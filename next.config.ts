/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["trukapp.s3.ap-south-1.amazonaws.com"],
  },
  //   typescript: {
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["trukapp.s3.ap-south-1.amazonaws.com"],
//   },

//   async rewrites() {
//     return [
//       // Rewrite API calls except for /api/auth/*
//       {
//         source: '/api/:path((?!auth).*)',  // Regex negative lookahead to exclude 'auth'
//         destination: 'http://13.127.36.10:8088/truk/:path*',
//         // destination: 'http://192.168.31.37:8088/truk/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
