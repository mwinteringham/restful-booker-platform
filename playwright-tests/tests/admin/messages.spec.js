const { test, expect } = require('@playwright/test');
const { tag, futureRange } = require('../support/data');
const { cleanup, createBooking } = require('../support/api');
const { knownDefect } = require('../support/known');

const unreadCount = async (page) => {
  const text = await page.locator('a[href="/admin/message"]').first().innerText();
  const m = text.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
};

test.describe('Guest message reaches the admin', () => {
  let t;
  test.beforeEach(() => { t = tag(); });
  test.afterEach(async ({ request }) => { await cleanup(request, t); });

  test('AT-08 a guest contact message appears in admin, unread until opened @smoke', async ({ page, browser, request }) => {
    const subject = `Autotest enquiry ${t}`;

    // Guest sends the message (a separate, logged-out browser context)
    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();
    await guestPage.goto('/');
    await guestPage.fill('#name', `Autotest ${t}`);
    await guestPage.fill('#email', 'autotest@example.com');
    await guestPage.fill('#phone', '01234567890');
    await guestPage.fill('#subject', subject);
    await guestPage.fill('#description', 'This is an automated test message for the admin.');
    await guestPage.getByRole('button', { name: 'Submit' }).click();
    await expect(guestPage.getByText(/Thanks for getting in touch/)).toBeVisible();
    await expect(guestPage.getByText(subject)).toBeVisible();
    await guestContext.close();

    // Admin sees it
    await page.goto('/admin/message');
    const row = page.getByText(subject);
    await expect(row).toBeVisible();
    // Check this message's own read flag, not the shared unread badge, which other tests also change
    const isRead = async () => (await (await request.get('/api/message')).json()).messages.find((m) => m.subject === subject).read;
    expect(await isRead()).toBe(false);
    expect(await unreadCount(page)).toBeGreaterThan(0);

    await row.click();
    await expect(page.getByText(`From: Autotest ${t}`)).toBeVisible();
    await expect(page.getByText('Phone: 01234567890')).toBeVisible();
    await expect(page.getByText('Email: autotest@example.com')).toBeVisible();
    await expect.poll(isRead).toBe(true);
  });

  // UI-08: the booking notification does not say which room was booked
  test('AT-22 the new-booking message tells the admin which room was booked @known-defect', async ({ page, request }) => {
    knownDefect(test, 'UI-08: the message has the guest and dates but no room number or type');
    const { checkin, checkout } = futureRange(2);
    const res = await createBooking(request, { roomid: 1, checkin, checkout, lastname: t });
    expect(res.status()).toBe(201);

    await page.goto('/admin/message');
    await page.getByText(`Autotest ${t}`).first().click();
    await expect(page.getByText('You have a new booking from')).toBeVisible();
    await expect(page.getByText(`${checkin} to ${checkout}`)).toBeVisible(); // the dates are there
    await expect(page.getByText(/\b101\b|\bSingle\b/)).toBeVisible(); // the room should be too
  });
});
