const { test, expect } = require('@playwright/test');

async function fillContact(page, v) {
  await page.fill('#name', v.name);
  await page.fill('#email', v.email);
  await page.fill('#phone', v.phone);
  await page.fill('#subject', v.subject);
  await page.fill('#description', v.description);
}

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('AT-09a empty form shows a message for every field', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    const alert = page.locator('#contact .alert');
    for (const msg of ['Name may not be blank', 'Email may not be blank', 'Phone may not be blank', 'Subject may not be blank', 'Message may not be blank']) {
      await expect(alert).toContainText(msg);
    }
  });

  test('AT-09b values outside the allowed format and length are rejected', async ({ page }) => {
    await fillContact(page, { name: 'Autotest', email: 'not-an-email', phone: '123', subject: 'Hi', description: 'too short' });
    await page.getByRole('button', { name: 'Submit' }).click();
    const alert = page.locator('#contact .alert');
    await expect(alert).toContainText('must be a well-formed email address');
    await expect(alert).toContainText('Phone must be between 11 and 21 characters');
    await expect(alert).toContainText('Subject must be between 5 and 100 characters');
    await expect(alert).toContainText('Message must be between 20 and 2000 characters');
    await expect(page.getByText(/Thanks for getting in touch/)).toHaveCount(0);
  });
});
