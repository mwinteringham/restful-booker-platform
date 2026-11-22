const { test, expect } = require('@playwright/test');

async function login(page, username, password) {
  await page.goto('/admin');
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#doLogin').click();
}

test.describe('Admin login', () => {
  test('AT-10a valid credentials open the rooms page @smoke', async ({ page }) => {
    await login(page, 'admin', 'password');
    await expect(page).toHaveURL(/\/admin\/rooms/);
    await expect(page.locator('#createRoom')).toBeVisible();
  });

  test('AT-10b wrong password is rejected with a message', async ({ page }) => {
    await login(page, 'admin', 'wrong-password');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).not.toHaveURL(/\/admin\/rooms/);
  });

  test('AT-10c empty username and password are rejected', async ({ page }) => {
    await login(page, '', '');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});

test.describe('Admin access when logged out', () => {
  for (const path of ['/admin/rooms', '/admin/message', '/admin/report', '/admin/branding']) {
    test(`AT-11a ${path} shows the login form, not admin data @smoke`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('#username')).toBeVisible();
      await expect(page.locator('#createRoom')).toHaveCount(0);
    });
  }

  test('AT-11b after logging out, Back does not show admin data', async ({ page }) => {
    await login(page, 'admin', 'password');
    await expect(page).toHaveURL(/\/admin\/rooms/);

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/localhost:3003\/?$/);

    await page.goBack();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#createRoom')).toHaveCount(0);
  });
});
