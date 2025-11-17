/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
};

export default nextConfig;
