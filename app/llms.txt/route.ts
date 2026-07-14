import { promises as fs } from "fs";
import path from "path";
import { SITE_URL } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a plain-text site guide for AI assistants,
// generated from the CMS content at build time so it never goes stale.
export const dynamic = "force-static";

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

export async function GET() {
  const companies = await readJsonDir<{
    name?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    website?: string;
  }>(path.join(process.cwd(), "content/affiliate-companies"));

  const insights = await readJsonDir<{
    title?: string;
    date?: string;
    excerpt?: string;
  }>(path.join(process.cwd(), "content/insights"));

  const sortedInsights = insights
    .filter((i) => i.title)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const lines: string[] = [
    "# The Birdsey Group, LLC",
    "",
    "> The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
    "",
    "The Birdsey Group is a real estate consulting firm headquartered in Atlanta, operating a family of affiliated companies that together cover commercial and residential real estate services: capital, mortgage diligence and underwriting, quality control, construction, and property preservation.",
    "",
    "## Main Pages",
    "",
    `- [Home](${SITE_URL}/): Overview of the firm, its affiliate companies, performance, news, careers, and contact form`,
    `- [About](${SITE_URL}/about): Company background and the full team, organized by group`,
    `- [The Birdsey Standard](${SITE_URL}/birdsey-standard): The firm's operating principles and commitments`,
    "",
    "## Affiliate Companies",
    "",
    ...companies
      .filter((c) => c.name)
      .map((c) => {
        const label = [c.title, c.subtitle].filter(Boolean).join(" ");
        const desc = c.description ? ` ${c.description}` : "";
        return `- [${c.name}](${c.website ?? SITE_URL}): ${label}.${desc}`;
      }),
    "",
    "## News & Insights",
    "",
    ...sortedInsights.map(
      (i) =>
        `- [${i.title}](${SITE_URL}/insights/${i._slug})${i.excerpt ? `: ${i.excerpt}` : ""}`
    ),
    "",
    "## Legal",
    "",
    `- [Privacy Policy](${SITE_URL}/privacy)`,
    `- [Terms of Service](${SITE_URL}/terms)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
