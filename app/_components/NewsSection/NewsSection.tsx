"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./newsSection.module.css";

interface Article {
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image?: string;
  url: string;
}

interface NewsSectionProps {
  title: string;
  articles: Article[];
}

export function NewsSection({ title, articles }: NewsSectionProps) {

  return (
    <Section id="news" className={styles.news}>
      <Flex direction="column" gap="1200">
        <h2 className={sharedStyles.sectionTitle}>{title}</h2>
        <Flex direction="column">
          {articles.map((article, i) => (
            <article key={i} className={styles.article}>
              <a href={article.url} className={styles.articleLink}>
                <div className={styles.articleImage} />
                <Flex direction="column" gap="400">
                  <p className={styles.articleDate}>{article.date}</p>
                  <h3 className={styles.articleTitle}>{article.title}</h3>
                  <p className={styles.articleExcerpt}>{article.excerpt}</p>
                </Flex>
                <IconArrowUpRight />
              </a>
            </article>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}
