/**
 * @jest-environment node
 */
import { DELETE, GET, POST } from '../app/api/[service]/[[...path]]/route';

const originalFetch = global.fetch;
const originalEnv = { ...process.env };
const context = (service: string) => ({ params: Promise.resolve({ service }) });

afterEach(() => {
  global.fetch = originalFetch;
  process.env = { ...originalEnv };
  jest.restoreAllMocks();
});

it.each([
  ['room', 'ROOM_API'],
  ['booking', 'BOOKING_API'],
  ['branding', 'BRANDING_API'],
  ['auth', 'AUTH_API'],
  ['report', 'REPORT_API'],
  ['message', 'MESSAGE_API'],
])('uses the runtime %s service URL, including paths and queries', async (service, variable) => {
  process.env[variable] = 'http://example.test:1234';
  const fetchMock = jest.fn().mockResolvedValue(new Response('{"ok":true}', {
    status: 201,
    headers: { 'content-type': 'application/json' }
  }));
  global.fetch = fetchMock;

  const response = await GET(
    new Request(`http://app.test/api/${service}/v3/api-docs?group=one`),
    context(service)
  );

  expect(fetchMock.mock.calls[0][0].toString()).toBe(
    `http://example.test:1234/${service}/v3/api-docs?group=one`
  );
  expect(response.status).toBe(201);
  expect(await response.json()).toEqual({ ok: true });
});

it('forwards a request body and cookies and preserves response cookies', async () => {
  process.env.AUTH_API = 'http://auth.test';
  const headers = new Headers();
  headers.append('set-cookie', 'token=abc; Path=/');
  headers.append('set-cookie', 'other=xyz; Path=/');
  const fetchMock = jest.fn().mockResolvedValue(new Response(null, { status: 200, headers }));
  global.fetch = fetchMock;

  const response = await POST(new Request('http://app.test/api/auth/login', {
    method: 'POST',
    headers: { cookie: 'existing=value', 'content-type': 'application/json' },
    body: '{"username":"admin"}'
  }), context('auth'));

  const options = fetchMock.mock.calls[0][1];
  expect(options.headers.get('cookie')).toBe('existing=value');
  expect(Buffer.from(options.body).toString()).toBe('{"username":"admin"}');
  expect(options.redirect).toBe('manual');
  expect(response.headers.getSetCookie()).toEqual(['token=abc; Path=/', 'other=xyz; Path=/']);
});

it('rewrites service redirects to the public API path', async () => {
  process.env.ROOM_API = 'http://room.test';
  global.fetch = jest.fn().mockResolvedValue(new Response(null, {
    status: 302,
    headers: { location: 'http://room.test/room/swagger-ui/index.html?config=x' }
  }));
  const response = await GET(
    new Request('http://app.test/api/room/swagger-ui.html'), context('room')
  );
  expect(response.headers.get('location')).toBe('/api/room/swagger-ui/index.html?config=x');
});

it('forwards a service root with the trailing slash expected by Spring', async () => {
  process.env.ROOM_API = 'http://room.test';
  const fetchMock = jest.fn().mockResolvedValue(new Response('{"rooms":[]}'));
  global.fetch = fetchMock;
  await GET(new Request('http://app.test/api/room?checkin=2026-01-01'), context('room'));
  expect(fetchMock.mock.calls[0][0].toString()).toBe(
    'http://room.test/room/?checkin=2026-01-01'
  );
});

it('preserves empty responses', async () => {
  global.fetch = jest.fn().mockResolvedValue(new Response(null, { status: 204 }));
  const response = await DELETE(new Request('http://app.test/api/room/1', {
    method: 'DELETE'
  }), context('room'));
  expect(response.status).toBe(204);
  expect(await response.text()).toBe('');
});

it('rejects unknown services without forwarding the request', async () => {
  global.fetch = jest.fn();
  const response = await GET(new Request('http://app.test/api/unknown'), context('unknown'));
  expect(response.status).toBe(404);
  expect(global.fetch).not.toHaveBeenCalled();
});

it('returns a gateway error when the service cannot be reached', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('connection refused'));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const response = await GET(new Request('http://app.test/api/room/1'), context('room'));
  expect(response.status).toBe(502);
  expect(console.error).toHaveBeenCalled();
});
