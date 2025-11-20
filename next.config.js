/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Explicitly enable Turbopack configuration to silence webpack warning
  turbopack: {},
  async rewrites() {
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      return [
        {
          source: "/storybook",
          destination: "http://localhost:6006/",
        },
        {
          source: "/storybook/:path*",
          destination: "http://localhost:6006/:path*",
        },
      ];
    }

    // In production, serve static Storybook build from public/storybook
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
      },
    ];
  },
  webpack: (config, { webpack, isServer }) => {
    // Ignore missing Tina generated files in production (using Tina Cloud)
    // Only needed when not using local Tina
    if (isServer && process.env.TINA_PUBLIC_IS_LOCAL !== "true") {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /tina\/__generated__\/databaseClient$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
