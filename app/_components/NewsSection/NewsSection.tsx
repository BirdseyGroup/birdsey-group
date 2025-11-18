"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import sharedStyles from "../shared.module.css";
import styles from "./newsSection.module.css";

export function NewsSection() {
  const articles = [
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
    { date: "22 OCTOBER 2025", category: "ARTICLE", title: "Article Header" },
  ];

  return (
    <Section className={styles.news}>
      <Flex direction="column" gap="1200">
        <h2 className={sharedStyles.sectionTitle}>Insights & Recognition.</h2>
        <Flex direction="column" gap="0">
          {articles.map((article, i) => (
            <article key={i} className={styles.article}>
              <p className={styles.articleDate}>{article.date}</p>
              <div className={styles.articleImage} />
              <Flex direction="column" gap="400">
                <p className={styles.articleCategory}>{article.category}</p>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <TextLink href="#">READ MORE</TextLink>
              </Flex>
              <IconArrowUpRight />
            </article>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}
