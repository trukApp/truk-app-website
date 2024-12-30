/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jai-mp.s3.eu-north-1.amazonaws.com'],
  },
};

module.exports = nextConfig;
