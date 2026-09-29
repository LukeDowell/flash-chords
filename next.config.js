/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    emotion: true
  },
  reactStrictMode: true,
  ...(process.env.BUILD_TARGET === 'mobile' ? {
    output: 'export',
    images: {unoptimized: true},
    trailingSlash: true,
  } : {}),
}

module.exports = nextConfig
