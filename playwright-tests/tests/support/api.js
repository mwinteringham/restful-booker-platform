// API helpers used for set-up and clean-up. The UI is used for the behaviour under test.

async function adminToken(request) {
  const res = await request.post('/api/auth/login', {
    data: { username: 'admin', password: 'password' },
  });
  return (await res.json()).token;
}

const asAdmin = (token) => ({ Cookie: `token=${token}` });

async function createBooking(request, { roomid = 1, checkin, checkout, firstname = 'Autotest', lastname, email = 'autotest@example.com', phone = '01234567890' }) {
  return request.post('/api/booking', {
    data: { roomid, firstname, lastname, depositpaid: false, email, phone, bookingdates: { checkin, checkout } },
  });
}

async function getRooms(request) {
  return (await (await request.get('/api/room')).json()).rooms;
}

async function createRoom(request, token, { roomName, roomPrice = 80 }) {
  return request.post('/api/room', {
    headers: asAdmin(token),
    data: {
      roomName,
      type: 'Single',
      accessible: false,
      image: '/images/room1.jpg',
      description: 'Autotest room, safe to delete',
      features: ['WiFi'],
      roomPrice,
    },
  });
}

// Delete everything a test created, identified by its unique tag. Safe to call when nothing exists.
async function cleanup(request, tagValue, { roomNames = [], extraRoomIds = [] } = {}) {
  const token = await adminToken(request);
  const headers = asAdmin(token);

  const roomIds = [...(await getRooms(request)).map((r) => r.roomid), ...extraRoomIds];
  for (const roomid of roomIds) {
    const res = await request.get(`/api/booking?roomid=${roomid}`, { headers });
    if (!res.ok()) continue;
    for (const b of (await res.json()).bookings || []) {
      if (b.lastname === tagValue) await request.delete(`/api/booking/${b.bookingid}`, { headers });
    }
  }
  const msgs = (await (await request.get('/api/message')).json()).messages || [];
  for (const m of msgs) {
    if (m.name.includes(tagValue)) await request.delete(`/api/message/${m.id}`, { headers });
  }
  for (const room of await getRooms(request)) {
    if (roomNames.includes(room.roomName)) await request.delete(`/api/room/${room.roomid}`, { headers });
  }
}

// Put the B&B name back through the API (the UI cannot be trusted to restore it: see UI-05 / UI-08).
// Other branding fields are never changed by the tests, so a possibly stale GET is a safe base.
async function setBrandingName(request, name, baseURL) {
  const token = await adminToken(request);
  const body = await (await request.get('/api/branding')).json();
  body.name = name;
  if (body.logoUrl && body.logoUrl.startsWith('/')) body.logoUrl = baseURL + body.logoUrl; // the API rejects relative logo URLs
  return request.put('/api/branding', { headers: asAdmin(token), data: body });
}

module.exports = { adminToken, asAdmin, createBooking, getRooms, createRoom, cleanup, setBrandingName };
