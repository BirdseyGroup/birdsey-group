/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [
      {
        // All hashed/optimized Next.js static output (JS, CSS, optimized images)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Public-folder assets (images, favicon, fonts)
        source: "/:path*\\.(svg|png|jpg|jpeg|webp|avif|ico|gif|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
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
