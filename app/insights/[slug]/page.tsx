import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Footer } from "../../_components/Footer";
import { Header } from "../../_components/Header";
import { ArticleDetail } from "../../_components/ArticleDetail";
import styles from "./page.module.css";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const insightsDir = path.join(process.cwd(), "content/insights");
  try {
    const files = await fs.readdir(insightsDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => ({ slug: file.replace(".json", "") }));
  } catch {
    return [];
  }
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;

  // Read article content
  const articlePath = path.join(
    process.cwd(),
    "content/insights",
    `${slug}.json`
  );

  let article;
  try {
    const articleFile = await fs.readFile(articlePath, "utf-8");
    article = JSON.parse(articleFile);
  } catch {
    notFound();
  }

  // Read global settings
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;

  return (
    <div className={`page-wrapper ${styles.insightPage}`}>
      <Header navItems={navigationContent?.items || []} />

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <ArticleDetail
            title={article.title}
            date={article.date}
            category={article.category}
            excerpt={article.excerpt}
            image={article.image}
            body={article.body}
          />
        </div>
      </main>

      <Footer
        phone={footerContent?.phone || ""}
        email={footerContent?.email || ""}
        address={footerContent?.address || ""}
        copyright={footerContent?.copyright || ""}
        navItems={navigationContent?.items || []}
      />
    </div>
  );
}
