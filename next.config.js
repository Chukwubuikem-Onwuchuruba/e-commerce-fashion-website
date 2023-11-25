/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  ...nextConfig,
  webpack: (config, { webpack }) => {
    // Add the handlebars loader rule
    config.module.rules.push({
      test: /\.handlebars$/,
      loader: "handlebars-loader",
    });

    // Return the modified config
    return config;
  },
};