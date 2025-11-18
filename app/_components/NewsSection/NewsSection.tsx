"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import sharedStyles from "../shared.module.css";
import styles from "./newsSection.module.css";

export function NewsSection() {
  const articles = [
    {
      date: "22 OCTOBER 2025",
      category: "ARTICLE",
      title: "Lorem ipsum dolor sit amet consectetur adipiscing",
      excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
    },
    {
      date: "15 OCTOBER 2025",
      category: "ARTICLE",
      title: "Sed do eiusmod tempor incididunt ut labore",
      excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
    },
    {
      date: "08 OCTOBER 2025",
      category: "ARTICLE",
      title: "Duis aute irure dolor in reprehenderit voluptate",
      excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur..."
    },
  ];

  return (
    <Section className={styles.news}>
      <Flex direction="column" gap="1200">
        <h2 className={sharedStyles.sectionTitle}>Insights & Recognition.</h2>
        <Flex direction="column" gap="0">
          {articles.map((article, i) => (
            <article key={i} className={styles.article}>
              <div className={styles.articleImage} />
              <Flex direction="column" gap="400">
                <p className={styles.articleDate}>{article.date}</p>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.articleExcerpt}>{article.excerpt}</p>
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
