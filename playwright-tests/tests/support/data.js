// Test data helpers: unique tags and far-future dates so tests never collide.

function tag() {
  return 'T' + Math.random().toString(36).slice(2, 8); // e.g. Tx7k2q1
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function iso(d) {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

// A date range somewhere in 2032-2039 so it cannot clash with seed data or other tests.
function futureRange(nights = 2) {
  const start = new Date(Date.UTC(2032, 0, 1));
  start.setUTCDate(start.getUTCDate() + Math.floor(Math.random() * 2500));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + nights);
  return { checkin: iso(start), checkout: iso(end) };
}

// A range well in the past (2005-2019)
function pastRange(nights = 2) {
  const start = new Date(Date.UTC(2005, 0, 1));
  start.setUTCDate(start.getUTCDate() + Math.floor(Math.random() * 5000));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + nights);
  return { checkin: iso(start), checkout: iso(end) };
}

// dd/mm/yyyy, the format the home page date pickers use
function ukDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function guest(t = tag()) {
  return {
    firstname: 'Autotest',
    lastname: t,
    email: 'autotest@example.com',
    phone: '01234567890',
  };
}

module.exports = { tag, futureRange, pastRange, ukDate, iso, guest };
