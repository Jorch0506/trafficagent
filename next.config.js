/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "@sparticuz/chromium",
        "playwright-core",
        "playwright",
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
