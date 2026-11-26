type RouteContext = {
  params: Promise<{ service: string; path?: string[] }>;
};

const hopByHopHeaders = [
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailer', 'transfer-encoding', 'upgrade'
];

function serviceUrl(service: string): string | undefined {
  switch (service) {
    case 'booking': return process.env.BOOKING_API || 'http://localhost:3000';
    case 'room': return process.env.ROOM_API || 'http://localhost:3001';
    case 'branding': return process.env.BRANDING_API || 'http://localhost:3002';
    case 'auth': return process.env.AUTH_API || 'http://localhost:3004';
    case 'report': return process.env.REPORT_API || 'http://localhost:3005';
    case 'message': return process.env.MESSAGE_API || 'http://localhost:3006';
    default: return undefined;
  }
}

function removeHopByHopHeaders(headers: Headers) {
  const connectionHeaders = headers.get('connection')?.split(',') ?? [];
  for (const header of [...hopByHopHeaders, ...connectionHeaders]) {
    headers.delete(header.trim());
  }
}

async function proxy(request: Request, { params }: RouteContext): Promise<Response> {
  const { service } = await params;
  const base = serviceUrl(service);
  if (!base) {
    return Response.json({ error: 'Unknown API service' }, { status: 404 });
  }

  const incoming = new URL(request.url);
  let servicePath = incoming.pathname.slice('/api'.length);
  if (servicePath === `/${service}`) {
    servicePath += '/';
  }
  const target = new URL(`${base.replace(/\/+$/, '')}${servicePath}${incoming.search}`);
  const headers = new Headers(request.headers);
  removeHopByHopHeaders(headers);
  headers.delete('host');
  headers.delete('content-length');

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.arrayBuffer(),
      redirect: 'manual',
      cache: 'no-store'
    });

    const responseHeaders = new Headers(response.headers);
    removeHopByHopHeaders(responseHeaders);
    // Node fetch decompresses responses, so the upstream encoding and length no longer apply.
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');

    const location = responseHeaders.get('location');
    if (location) {
      const redirect = new URL(location, target);
      if (redirect.origin === target.origin &&
          (redirect.pathname === `/${service}` || redirect.pathname.startsWith(`/${service}/`))) {
        responseHeaders.set('location', `/api${redirect.pathname}${redirect.search}${redirect.hash}`);
      }
    }

    const cookies = response.headers.getSetCookie();
    responseHeaders.delete('set-cookie');
    for (const cookie of cookies) {
      responseHeaders.append('set-cookie', cookie);
    }

    return new Response(
      request.method === 'HEAD' || [204, 205, 304].includes(response.status) ? null : response.body,
      { status: response.status, statusText: response.statusText, headers: responseHeaders }
    );
  } catch (error) {
    console.error(`Error proxying ${service} API request:`, error);
    return Response.json({ error: 'API service unavailable' }, { status: 502 });
  }
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
