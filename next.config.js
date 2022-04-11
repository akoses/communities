/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/create-community',
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
  async redirects() {
    return [
       {
        source: "/discord",
        destination: 'https://discord.gg/kxKCZ8YAAe',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
