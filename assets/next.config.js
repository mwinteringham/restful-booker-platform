/** @type {import('next').NextConfig} */
const bookingApi = process.env.BOOKING_API || 'http://localhost:3000';
const roomApi = process.env.ROOM_API || 'http://localhost:3001';
const brandingApi = process.env.BRANDING_API || 'http://localhost:3002';
const authApi = process.env.AUTH_API || 'http://localhost:3004';
const reportApi = process.env.REPORT_API || 'http://localhost:3005';
const messageApi = process.env.MESSAGE_API || 'http://localhost:3006';

const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/room/:path*',
        destination: `${roomApi}/room/:path*`
      },
      {
        source: '/api/branding/:path*',
        destination: `${brandingApi}/branding/:path*`
      },
      {
        source: '/api/auth/:path*',
        destination: `${authApi}/auth/:path*`
      },
      {
        source: '/api/report/:path*',
        destination: `${reportApi}/report/:path*`
      },
      {
        source: '/api/message/:path*',
        destination: `${messageApi}/message/:path*`
      },
      {
        source: '/api/booking/:path*',
        destination: `${bookingApi}/booking/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
