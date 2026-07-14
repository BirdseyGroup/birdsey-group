import { promises as fs } from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

async function readJsonDir<T>(dir: string): Promise<Array<T & { _slug: string }>> {
  try {
    const files = await fs.readdir(dir);
    return Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const raw = await fs.readFile(path.join(dir, f), "utf-8");
          return { ...(JSON.parse(raw) as T), _slug: f.replace(/\.json$/, "") };
        })
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = await readJsonDir<{ date?: string }>(
    path.join(process.cwd(), "content/insights")
  );

  // Custom pages have an editor-controlled `url` field independent of their
  // filename, so the sitemap has to read each file's content rather than
  // just listing filenames.
  const customPages = await readJsonDir<{ url?: string }>(
    path.join(process.cwd(), "content/custom-pages")
  );

  // Team members only get a public page when their profile is enabled.
  const teamMembers = await readJsonDir<{ profilePageEnabled?: boolean }>(
    path.join(process.cwd(), "content/team")
  );

  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/birdsey-standard`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...insights.map((insight) => {
      const published = insight.date ? new Date(insight.date) : now;
      return {
        url: `${SITE_URL}/insights/${insight._slug}`,
        lastModified: Number.isNaN(published.getTime()) ? now : published,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
    ...teamMembers
      .filter((member) => member.profilePageEnabled)
      .map((member) => ({
        url: `${SITE_URL}/team/${member._slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
    ...customPages
      .filter((page): page is typeof page & { url: string } => Boolean(page.url))
      .map((page) => ({
        url: `${SITE_URL}/${page.url}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ];
}
