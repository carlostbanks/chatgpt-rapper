module.exports = {
  reactStrictMode: true,
  // Configure API endpoints
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
}