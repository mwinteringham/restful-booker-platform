const { test: setup, expect } = require('@playwright/test');

setup('log in as admin and save the session', async ({ page }) => {
  await page.goto('/admin');
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('password');
  await page.locator('#doLogin').click();
  await expect(page).toHaveURL(/\/admin\/rooms/);
  await page.context().storageState({ path: '.auth/admin.json' });
});
