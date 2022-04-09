/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/create-college',
        destination: '/',
      },
      {
        source: '/:college/events',
        destination: '/:college',
      },
      {
        source: '/:college/opportunities',
        destination: '/:college',
      },
      {
        source: '/:college/resources',
        destination: '/:college',
      },
    ]
  },
}

module.exports = nextConfig
