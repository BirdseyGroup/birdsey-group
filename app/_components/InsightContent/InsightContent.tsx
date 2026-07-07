"use client";

import { useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type {
  GlobalQuery,
  GlobalQueryVariables,
  InsightQuery,
  InsightQueryVariables,
} from "@/tina/__generated__/types";
import { ArticleDetail } from "../ArticleDetail";
import { Footer } from "../Footer";
import { Header } from "../Header";
import styles from "./insightContent.module.css";

interface QueryResponse<TData, TVariables> {
  data: TData;
  query: string;
  variables: TVariables;
}

type InsightResponse = QueryResponse<InsightQuery, InsightQueryVariables>;
type GlobalResponse = QueryResponse<GlobalQuery, GlobalQueryVariables>;

interface InsightContentProps {
  insightResponse: InsightResponse;
  globalResponse: GlobalResponse;
}

export function InsightContent({
  insightResponse,
  globalResponse,
}: InsightContentProps) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.self !== window.top);
  }, []);

  if (isPreview) {
    return (
      <EditableInsight
        insightResponse={insightResponse}
        globalResponse={globalResponse}
      />
    );
  }

  return (
    <RenderedInsight
      insight={insightResponse.data.insight}
      global={globalResponse.data.global}
    />
  );
}

// Only mounted (and useTina only ever called) when the page detects it's
// running inside Tina's own admin preview iframe — regular visitors never
// pay the deep-clone/tree-walk cost useTina does on every render.
function EditableInsight({
  insightResponse,
  globalResponse,
}: InsightContentProps) {
  const { data: insightData } = useTina(insightResponse);
  const { data: globalData } = useTina(globalResponse);

  return (
    <RenderedInsight insight={insightData.insight} global={globalData.global} />
  );
}

function RenderedInsight({
  insight,
  global,
}: {
  insight: InsightQuery["insight"];
  global: GlobalQuery["global"];
}) {
  const navigationItems = (global.navigation?.items ?? []).filter(
    (item) => item != null
  );
  const footer = global.footer;
  const footerNavExtras = (footer?.footerNavExtras ?? []).filter(
    (item) => item != null
  );
  const footerLinks = (footer?.footerLinks ?? [])
    .filter((item) => item != null)
    .map((item) => ({
      ...item,
      openCookieSettings: item.openCookieSettings ?? undefined,
    }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    ...(insight.image && {
      image: `https://www.birdseygroup.com${insight.image}`,
    }),
    ...(insight.date && { datePublished: insight.date }),
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
      <Header navItems={navigationItems} />

      <main id="main-content" className={styles.mainContent}>
        <div className={styles.container}>
          <ArticleDetail
            title={insight.title}
            titleTinaField={tinaField(insight, "title")}
            date={insight.date}
            category={insight.category}
            categoryTinaField={tinaField(insight, "category")}
            excerpt={insight.excerpt}
            excerptTinaField={tinaField(insight, "excerpt")}
            image={insight.image || undefined}
            imageTinaField={tinaField(insight, "image")}
            body={insight.body}
            bodyTinaField={tinaField(insight, "body")}
          />
        </div>
      </main>

      <Footer
        phone={footer?.phone || ""}
        email={footer?.email || ""}
        address={footer?.address || ""}
        copyright={footer?.copyright || ""}
        navItems={navigationItems}
        footerNavExtras={footerNavExtras}
        footerLinks={footerLinks}
      />
    </div>
  );
}
