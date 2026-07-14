import type { MetadataRoute } from "next";
import { IS_INDEXABLE, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Staging/preview deployments must not be crawled at all; only the real
  // production domain is indexable (see lib/seo.ts).
  if (!IS_INDEXABLE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/storybook"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
