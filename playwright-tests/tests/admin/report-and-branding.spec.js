const { test, expect } = require('@playwright/test');
const { knownDefect } = require('../support/known');
const { tag, iso } = require('../support/data');
const { createBooking, cleanup, setBrandingName } = require('../support/api');

const SEED_NAME = 'Shady Meadows B&B';

test.describe('Admin report', () => {
  let t;
  test.beforeEach(() => { t = tag(); });
  test.afterEach(async ({ request }) => { await cleanup(request, t); });

  test('AT-17 a guest booking appears on the admin report', async ({ page, request }) => {
    // 5 to 60 days ahead on the Suite (room 3), so it cannot clash with the far-future dates other tests use
    // Other bookings may already sit on those dates (409), so try a few different ranges.
    let start;
    let created = false;
    for (let attempt = 0; attempt < 10 && !created; attempt++) {
      start = new Date();
      start.setUTCDate(start.getUTCDate() + 5 + Math.floor(Math.random() * 55));
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 2);
      const res = await createBooking(request, { roomid: 3, checkin: iso(start), checkout: iso(end), lastname: t });
      created = res.status() === 201;
    }
    expect(created, 'found free dates on room 3 to book').toBe(true);

    const reportLoaded = page.waitForResponse((r) => r.url().includes('/api/report'));
    await page.goto('/admin/report');
    await reportLoaded;

    // Step forward through the calendar months until the booking shows (at most 3 months)
    const event = page.locator('.rbc-event', { hasText: `Autotest ${t} - Room: 103` }).first();
    for (let i = 0; i < 3 && !(await event.isVisible()); i++) {
      await page.locator('.rbc-toolbar button', { hasText: 'Next' }).click();
    }
    await expect(event).toBeVisible();
  });
});

// These tests change the public B&B name, so they run one after the other and always put it back.
test.describe.serial('Admin branding', () => {
  test.afterEach(async ({ request, baseURL }) => {
    await setBrandingName(request, SEED_NAME, baseURL);
  });

  // UI-05: on a freshly started instance the seeded logo (/images/rbp-logo.jpg) fails validation
  test('AT-16a branding saves when only the B&B name is changed @known-defect', async ({ page }) => {
    await page.goto('/admin/branding');
    await expect(page.locator('#logoUrl')).not.toHaveValue('');
    const logo = await page.locator('#logoUrl').inputValue();
    if (logo.startsWith('/')) {
      knownDefect(test, 'UI-05: the seeded relative logo URL is rejected: "Url should be a correct url format"');
    }

    await page.locator('#name').fill(`Autotest B&B ${tag()}`);
    await page.locator('#updateBranding').click();
    await expect(page.locator('.alert')).toHaveCount(0);
  });

  // UI-09: the public site keeps serving the old branding for up to a minute
  test('AT-16b a saved B&B name shows on the public site within 10 seconds @known-defect', async ({ page, browser, request, baseURL }) => {
    knownDefect(test, 'UI-09: /api/branding is cached for 60 seconds and the save does not clear it');
    const newName = `Autotest B&B ${tag()}`;
    // Save through the API so this test does not depend on UI-05
    expect((await setBrandingName(request, newName, baseURL)).ok()).toBe(true);

    const guest = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const home = await guest.newPage();
    await home.goto('/');
    await expect.poll(async () => {
      await home.reload();
      return (await home.locator('nav').first().innerText()).includes(newName);
    }, { timeout: 10_000, intervals: [1000] }).toBe(true);
    await guest.close();
  });
});
