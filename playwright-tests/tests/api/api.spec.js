// Supporting API checks: things the UI cannot show but that affect guests directly.
const { test, expect } = require('@playwright/test');
const { knownDefect } = require('../support/known');
const { tag, futureRange, pastRange, iso } = require('../support/data');
const { createBooking, cleanup } = require('../support/api');

const NO_ACCESS = [401, 403];
const expectDenied = (status, what = 'request') =>
  expect(NO_ACCESS.includes(status), `${what} without a token should be 401/403 but was ${status}`).toBe(true);

test.describe('Access control', () => {
  // API-01: guests can read contact messages and the personal details in them
  test('AT-18a guest cannot list contact messages @known-defect', async ({ request }) => {
    knownDefect(test, 'API-01: GET /api/message returns 200 without a token');
    const res = await request.get('/api/message');
    expectDenied(res.status());
  });

  test('AT-18b guest cannot read a single message with name, email and phone @known-defect', async ({ request }) => {
    knownDefect(test, 'API-01: GET /api/message/{id} returns personal data without a token');
    const res = await request.get('/api/message/1');
    expectDenied(res.status());
  });

  test('AT-18c guest cannot read bookings, the report, or change rooms and branding', async ({ request }) => {
    for (const path of ['/api/booking', '/api/report']) {
      expectDenied((await request.get(path)).status(), `GET ${path}`);
    }
    const room = await request.post('/api/room', { data: { roomName: '900', type: 'Single', accessible: false, image: 'x', description: 'x', features: [], roomPrice: 10 } });
    expectDenied(room.status(), 'POST /api/room');
    expectDenied((await request.put('/api/branding', { data: {} })).status(), 'PUT /api/branding');
    expectDenied((await request.delete('/api/room/1')).status(), 'DELETE /api/room/1');
  });
});

test.describe('Booking rules', () => {
  let t;
  test.beforeEach(() => { t = tag(); });
  test.afterEach(async ({ request }) => { await cleanup(request, t, { extraRoomIds: [99999] }); });

  test('AT-20 overlapping dates are refused, back-to-back stays are allowed', async ({ request }) => {
    const { checkin, checkout } = futureRange(2);
    const day = (offset) => {
      const d = new Date(checkin + 'T00:00:00Z');
      d.setUTCDate(d.getUTCDate() + offset);
      return iso(d);
    };
    const book = (a, b) => createBooking(request, { roomid: 2, checkin: a, checkout: b, lastname: t });

    expect((await book(checkin, checkout)).status()).toBe(201);
    expect((await book(checkin, checkout)).status(), 'exact same dates').toBe(409);
    expect((await book(day(-1), day(1))).status(), 'overlaps the start').toBe(409);
    expect((await book(day(1), day(3))).status(), 'overlaps the end').toBe(409);
    expect((await book(day(-1), day(3))).status(), 'encloses the booking').toBe(409);
    expect((await book(day(2), day(4))).status(), 'starts the day it ends').toBe(201);
  });

  test('AT-19a booking for a nonexistent room is refused @known-defect', async ({ request }) => {
    knownDefect(test, 'API-02: returns 201 for roomid 99999');
    const { checkin, checkout } = futureRange(2);
    const res = await createBooking(request, { roomid: 99999, checkin, checkout, lastname: t });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('AT-19b booking dates in the past are refused @known-defect', async ({ request }) => {
    knownDefect(test, 'API-02: returns 201 for dates in the past');
    const { checkin, checkout } = pastRange(2);
    const res = await createBooking(request, { roomid: 3, checkin, checkout, lastname: t });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('AT-19c a 20-year stay is refused @known-defect', async ({ request }) => {
    knownDefect(test, 'API-02: returns 201 for a 20-year stay');
    const { checkin } = futureRange(1);
    const end = new Date(checkin + 'T00:00:00Z');
    end.setUTCFullYear(end.getUTCFullYear() + 20);
    const res = await createBooking(request, { roomid: 3, checkin, checkout: iso(end), lastname: t });
    expect(res.status()).toBeGreaterThanOrEqual(400);
    expect(res.status()).toBeLessThan(500);
  });

  test('AT-19d impossible and badly formatted dates are refused', async ({ request }) => {
    for (const [checkin, checkout] of [['2032-02-30', '2032-03-02'], ['01-07-2032', '03-07-2032'], ['2032-06-12', '2032-06-10'], ['2032-06-10', '2032-06-10']]) {
      const res = await createBooking(request, { roomid: 2, checkin, checkout, lastname: t });
      expect(res.status(), `${checkin} to ${checkout}`).toBeGreaterThanOrEqual(400);
    }
  });
});

test.describe('Session handling', () => {
  // API-03: logout never invalidates the token on the server
  test('AT-21 a token stops working after logout @known-defect', async ({ request }) => {
    knownDefect(test, 'API-03: the logout route is a stub, so the token stays valid');
    const login = await request.post('/api/auth/login', { data: { username: 'admin', password: 'password' } });
    const { token } = await login.json();
    expect((await (await request.post('/api/auth/validate', { data: { token } })).json()).valid).toBe(true);

    await request.post('/api/auth/logout', { data: { token } });

    const after = await request.post('/api/auth/validate', { data: { token } });
    expect(after.status() === 200 ? (await after.json()).valid : false).toBe(false);
  });
});
