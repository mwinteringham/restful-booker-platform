// Small page objects for the guest journey and admin screens.
const { expect } = require('@playwright/test');
const { ukDate } = require('./data');

class HomePage {
  constructor(page) {
    this.page = page;
    this.checkIn = page.locator('#booking input').nth(0);
    this.checkOut = page.locator('#booking input').nth(1);
    this.checkButton = page.getByRole('button', { name: 'Check Availability' });
    this.bookLinks = page.locator('#rooms a:has-text("Book now")');
  }
  async goto() {
    await this.page.goto('/');
    // The heading carries the B&B name, which the branding tests change, so match only the fixed part
    await expect(this.page.getByRole('heading', { name: /^Welcome to/i }).first()).toBeVisible();
  }
  async search(checkinIso, checkoutIso) {
    await this.checkIn.fill(ukDate(checkinIso));
    await this.checkIn.press('Enter');
    await this.checkOut.fill(ukDate(checkoutIso));
    await this.checkOut.press('Enter');
    await this.checkButton.click();
  }
  async bookLinkHrefs() {
    return this.bookLinks.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  }
}

class ReservationPage {
  constructor(page) {
    this.page = page;
    this.reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    this.crashMessage = page.getByText(/couldn.t load/i);
  }
  async goto(roomId, checkin, checkout) {
    const query = checkin ? `?checkin=${checkin}&checkout=${checkout}` : '';
    await this.page.goto(`/reservation/${roomId}${query}`);
  }
  async openGuestForm() {
    await this.reserveButton.click();
    await expect(this.page.locator('[name=firstname]')).toBeVisible();
  }
  async fillGuest({ firstname, lastname, email, phone }) {
    await this.page.fill('[name=firstname]', firstname);
    await this.page.fill('[name=lastname]', lastname);
    await this.page.fill('[name=email]', email);
    await this.page.fill('[name=phone]', phone);
  }
  async submit() {
    await this.reserveButton.click();
  }
  async reserve(guest) {
    await this.openGuestForm();
    await this.fillGuest(guest);
    await this.submit();
  }
}

class AdminRoomsPage {
  constructor(page) {
    this.page = page;
    this.alerts = page.locator('.alert');
    this.createButton = page.locator('#createRoom');
  }
  async goto() {
    await this.page.goto('/admin/rooms');
    await expect(this.createButton).toBeVisible();
  }
  row(name) {
    return this.page.locator(`#roomName${name}`);
  }
  async create({ name, price, wifi = true }) {
    await this.page.locator('#roomName').fill(name);
    await this.page.locator('#roomPrice').fill(String(price));
    if (wifi) await this.page.locator('#wifiCheckbox').check();
    await this.createButton.click();
  }
}

module.exports = { HomePage, ReservationPage, AdminRoomsPage };
