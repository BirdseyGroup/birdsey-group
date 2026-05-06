import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../_components/Footer";
import { Header } from "../../_components/Header";
import { ArticleDetail } from "../../_components/ArticleDetail";
import styles from "./page.module.css";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  const articlePath = path.join(
    process.cwd(),
    "content/insights",
    `${slug}.json`
  );
  try {
    const articleFile = await fs.readFile(articlePath, "utf-8");
    return JSON.parse(articleFile);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  const url = `https://www.birdseygroup.com/insights/${slug}`;

  return {
    title: `${article.title} | Birdsey Group`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      ...(article.image && {
        images: [
          {
            url: `https://www.birdseygroup.com${article.image}`,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.image && {
        images: [`https://www.birdseygroup.com${article.image}`],
      }),
    },
  };
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

  const article = await getArticle(slug);
  if (!article) notFound();

  // Read global settings
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    ...(article.image && {
      image: `https://www.birdseygroup.com${article.image}`,
    }),
    ...(article.date && { datePublished: article.date }),
    author: {
      "@type": "Organization",
      name: "The Birdsey Group, LLC",
      url: "https://www.birdseygroup.com",
    },
    publisher: {
      "@type": "Organization",
      name: "The Birdsey Group, LLC",
      logo: {
        "@type": "ImageObject",
        url: "https://www.birdseygroup.com/images/birdsey-group-logo.svg",
      },
    },
  };

  return (
    <div className={`page-wrapper ${styles.insightPage}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Header navItems={navigationContent?.items || []} />

      <main id="main-content" className={styles.mainContent}>
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
