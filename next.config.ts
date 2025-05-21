// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["trukapp.s3.ap-south-1.amazonaws.com"],
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["trukapp.s3.ap-south-1.amazonaws.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/count-data', // frontend path
        destination: 'http://13.127.36.10:8088/truk/data/count-data', // backend API
      },
    ];
  },
};

module.exports = nextConfig;
