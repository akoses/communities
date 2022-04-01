/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
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
