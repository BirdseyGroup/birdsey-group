import { promises as fs } from "fs";
import path from "path";
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.birdseygroup.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insightsDir = path.join(process.cwd(), "content/insights");
  let insightSlugs: string[] = [];
  try {
    const files = await fs.readdir(insightsDir);
    insightSlugs = files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    insightSlugs = [];
  }

  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/birdsey-standard`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...insightSlugs.map((slug) => ({
      url: `${SITE_URL}/insights/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
