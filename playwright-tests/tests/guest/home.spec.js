const { test, expect } = require('@playwright/test');
const { knownDefect } = require('../support/known');
const { HomePage } = require('../support/pages');

test.describe('Home page', () => {
  test('AT-01 home page loads with the three rooms and no errors @smoke', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle(/Restful-booker-platform/i);
    await expect(home.bookLinks).toHaveCount(3);
    await expect(page.locator('#rooms')).toContainText('Single');
    await expect(page.locator('#rooms')).toContainText('Double');
    await expect(page.locator('#rooms')).toContainText('Suite');
    expect(errors).toEqual([]);
  });

  // UI-04: past, reversed and invalid dates are accepted
  test('AT-07a searching with dates in the past is not allowed @known-defect', async ({ page }) => {
    knownDefect(test, 'UI-04: past dates are accepted and rooms are offered');
    const home = new HomePage(page);
    await home.goto();
    await home.search('2020-01-01', '2020-01-03');

    const hrefs = await home.bookLinkHrefs();
    expect(hrefs.filter((h) => h.includes('checkin=2020-01-01'))).toEqual([]);
  });

  test('AT-07b check-out before check-in is not allowed @known-defect', async ({ page }) => {
    knownDefect(test, 'UI-04: reversed dates are accepted and rooms are offered');
    const home = new HomePage(page);
    await home.goto();
    await home.search('2032-12-12', '2032-12-10');

    const hrefs = await home.bookLinkHrefs();
    expect(hrefs.filter((h) => h.includes('checkout=2032-12-10'))).toEqual([]);
  });
});
