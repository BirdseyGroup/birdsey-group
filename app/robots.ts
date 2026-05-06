import type { MetadataRoute } from "next";

const SITE_URL = "https://www.birdseygroup.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/storybook"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
