const { test, expect } = require('@playwright/test');
const { knownDefect } = require('../support/known');
const { AdminRoomsPage, HomePage } = require('../support/pages');
const { tag, futureRange } = require('../support/data');
const { adminToken, createRoom, createBooking, getRooms, cleanup } = require('../support/api');

test.describe('Admin rooms', () => {
  let t;
  let roomName;
  test.beforeEach(() => { t = tag(); roomName = `Auto${t}`; });
  test.afterEach(async ({ request }) => { await cleanup(request, t, { roomNames: [roomName] }); });

  // UI-03: only the first three rooms are shown on the public site
  test('AT-12 a room created by admin is listed in admin and on the public site @known-defect', async ({ page, request }) => {
    knownDefect(test, 'UI-03: the home page shows only the first three rooms (rooms.slice(0, 3))');
    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await rooms.create({ name: roomName, price: 80 });
    await expect(rooms.row(roomName)).toBeVisible(); // admin side works

    const total = (await getRooms(request)).length;
    const home = new HomePage(page);
    await home.goto();
    await expect(home.bookLinks).toHaveCount(total); // public side should list every room
  });

  test('AT-13 editing a room price and description persists', async ({ page, request }) => {
    const token = await adminToken(request);
    expect((await createRoom(request, token, { roomName, roomPrice: 80 })).ok()).toBe(true);

    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await rooms.row(roomName).click();
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await page.locator('.room-details #roomPrice').fill('120');
    await page.locator('.room-details #description').fill('An updated description written by the automated test.');
    await page.locator('#update').click();
    await expect(page.locator('.room-details')).toContainText('Room price: 120');

    const saved = (await getRooms(request)).find((r) => r.roomName === roomName);
    expect(saved.roomPrice).toBe(120);
    expect(saved.description).toContain('updated description');
  });

  // UI-07: vague admin errors
  test('AT-14a empty room form says what is missing @known-defect', async ({ page }) => {
    knownDefect(test, 'UI-07: the only message is "Failed to create room"');
    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await rooms.createButton.click();
    await expect(rooms.alerts.first()).toContainText(/name/i);
  });

  test('AT-14b a decimal price says what is wrong @known-defect', async ({ page }) => {
    knownDefect(test, 'UI-07: the only message is "Failed to create room"');
    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await rooms.create({ name: roomName, price: '99.99' });
    await expect(rooms.alerts.first()).toContainText(/price/i);
  });

  test('AT-14c price outside 1 to 999 is rejected', async ({ page }) => {
    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await rooms.create({ name: roomName, price: '-5' });
    await expect(rooms.alerts.first()).toContainText('greater than or equal to 1');
    await rooms.create({ name: roomName, price: '100000' });
    await expect(rooms.alerts.first()).toContainText('less than or equal to 999');
    await expect(rooms.row(roomName)).toHaveCount(0);
  });

  // UI-10: the admin form lets you create a second room with an existing room number
  test('AT-23 a room number that already exists cannot be created again @known-defect', async ({ page, request }) => {
    knownDefect(test, 'UI-10: the duplicate room is created with no error');
    const token = await adminToken(request);
    expect((await createRoom(request, token, { roomName })).ok()).toBe(true);

    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await expect(rooms.row(roomName)).toHaveCount(1);
    await rooms.create({ name: roomName, price: 90 });

    await expect(rooms.alerts.first()).toBeVisible();
    const sameName = (await getRooms(request)).filter((r) => r.roomName === roomName);
    expect(sameName).toHaveLength(1);
  });

  // UI-06: delete has no confirmation and orphans bookings
  test('AT-15 deleting a room that has a booking asks for confirmation @known-defect', async ({ page, request }) => {
    knownDefect(test, 'UI-06: the room is deleted immediately, with no confirmation or warning');
    const token = await adminToken(request);
    expect((await createRoom(request, token, { roomName })).ok()).toBe(true);
    const room = (await getRooms(request)).find((r) => r.roomName === roomName);
    const { checkin, checkout } = futureRange(2);
    expect((await createBooking(request, { roomid: room.roomid, checkin, checkout, lastname: t })).status()).toBe(201);

    let dialogSeen = false;
    page.on('dialog', (d) => { dialogSeen = true; d.dismiss(); });
    const rooms = new AdminRoomsPage(page);
    await rooms.goto();
    await page.locator(`span.roomDelete[id="${room.roomid}"]`).click();

    const inPageConfirm = await page.getByText(/are you sure|confirm|has bookings/i).isVisible().catch(() => false);
    expect(dialogSeen || inPageConfirm).toBe(true);
    await expect(rooms.row(roomName)).toBeVisible(); // still there until the admin confirms
  });
});
