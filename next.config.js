const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  i18n,
  images: {
    domains: ["s2.coinmarketcap.com"],
  },
  experimental: {
    optimizeCss: true
  }
};

module.exports = nextConfig;
