/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/room/:path*',
        destination: `http://rbp-room:3001/room/:path*`
      },
      {
        source: '/api/branding/:path*',
        destination: `http://rbp-branding:3002/branding/:path*`
      },
      {
        source: '/api/auth/:path*',
        destination: `http://rbp-auth:3004/auth/:path*`
      },
      {
        source: '/api/report/:path*',
        destination: `http://rbp-report:3005/report/:path*`
      },
      {
        source: '/api/message/:path*',
        destination: `http://rbp-message:3006/message/:path*`
      },
      {
        source: '/api/booking/:path*',
        destination: `http://rbp-booking:3000/booking/swagger-ui/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
