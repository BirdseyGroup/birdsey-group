"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, Section } from "@/components/layout";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./newsSection.module.css";

gsap.registerPlugin(ScrollTrigger);

function formatDate(dateStr: string) {
  // A bare "YYYY-MM-DD" needs a time appended so it parses in the local
  // timezone rather than UTC (which can shift the displayed date by a day).
  // A `datetime` field's live-edit value already includes a "T", so only
  // append when it's missing.
  const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

interface Article {
  date: string;
  hideDate?: boolean;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  url: string;
}

interface NewsArticleReference {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string | null;
  _sys: { filename: string };
}

interface NewsArticleInput {
  date?: string | null;
  hideDate?: boolean | null;
  category?: string | null;
  title?: string | null;
  excerpt?: string | null;
  image?: string | null;
  url?: string | null;
  // While actively editing in the live preview, Tina patches a reference
  // field with the raw, unresolved file path (a string) rather than the
  // full referenced document — only a saved-and-requeried page gets the
  // resolved object. Handle both shapes so the preview isn't blank.
  postReference?: NewsArticleReference | string | null;
}

function filenameToTitle(path: string) {
  const slug = path.split("/").pop()?.replace(/\.json$/, "") ?? path;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// A News article can be picked from the Insights collection via a reference,
// or entered manually — any manually-filled field overrides the referenced
// article's value for that field, so an editor can e.g. swap just the
// excerpt while keeping everything else in sync with the real post.
export function resolveNewsArticle(
  article: NewsArticleInput,
  tinaFields?: {
    title?: string;
    excerpt?: string;
    image?: string;
    postReference?: string;
  }
): {
  article: Article;
  tinaFields: { title?: string; excerpt?: string; image?: string };
} {
  const raw = article.postReference;
  const ref = typeof raw === "object" ? raw : null;
  const unresolvedFilename =
    typeof raw === "string"
      ? raw.split("/").pop()?.replace(/\.json$/, "")
      : undefined;

  return {
    article: {
      date: article.date || ref?.date || "",
      hideDate: article.hideDate ?? undefined,
      category: article.category || ref?.category || "",
      title:
        article.title ||
        ref?.title ||
        (typeof raw === "string" ? filenameToTitle(raw) : "") ||
        "",
      excerpt: article.excerpt || ref?.excerpt || "",
      image: article.image || ref?.image || undefined,
      url:
        article.url ||
        (ref
          ? `/insights/${ref._sys.filename}`
          : unresolvedFilename
            ? `/insights/${unresolvedFilename}`
            : ""),
    },
    tinaFields: {
      title: article.title ? tinaFields?.title : tinaFields?.postReference,
      excerpt: article.excerpt
        ? tinaFields?.excerpt
        : tinaFields?.postReference,
      image: article.image ? tinaFields?.image : tinaFields?.postReference,
    },
  };
}

interface NewsSectionProps {
  title: string;
  titleTinaField?: string;
  articles: Article[];
  articlesTinaFields?: Array<{
    title?: string;
    excerpt?: string;
    image?: string;
  }>;
}

export function NewsSection({
  title,
  titleTinaField,
  articles,
  articlesTinaFields,
}: NewsSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const articlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Kill any existing ScrollTriggers for these elements
    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.trigger === titleRef.current ||
        trigger.trigger === articlesRef.current
      ) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate articles with stagger
      gsap.from(articlesRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: articlesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Section id="news" className={styles.news}>
      <Flex direction="column" gap="1200">
        <h2
          className={sharedStyles.sectionTitle}
          ref={titleRef}
          data-tina-field={titleTinaField}
        >
          {title}
        </h2>
        <div ref={articlesRef}>
          <Flex direction="column">
            {articles.map((article, i) => (
              <article key={i} className={styles.article}>
                <a href={article.url} className={styles.articleLink}>
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className={styles.articleImage}
                      data-tina-field={articlesTinaFields?.[i]?.image}
                    />
                  ) : (
                    <div className={styles.articleImagePlaceholder} />
                  )}
                  <Flex direction="column" gap="300">
                    {article.date && !article.hideDate && (
                      <p className={styles.articleDate}>{formatDate(article.date)}</p>
                    )}
                    <h3
                      className={styles.articleTitle}
                      data-tina-field={articlesTinaFields?.[i]?.title}
                    >
                      {article.title}
                    </h3>
                    <p
                      className={styles.articleExcerpt}
                      data-tina-field={articlesTinaFields?.[i]?.excerpt}
                    >
                      {article.excerpt}
                    </p>
                    <div className={styles.readMoreLink}>Read More</div>
                  </Flex>

                  <div className={styles.readMoreIcon}>
                    <IconArrowUpRight />
                  </div>
                </a>
              </article>
            ))}
          </Flex>
        </div>
      </Flex>
    </Section>
  );
}
