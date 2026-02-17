"use client";

import { IconArrowUpRight } from "@/components/icons";
import { Flex, Section } from "@/components/layout";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./newsSection.module.css";

gsap.registerPlugin(ScrollTrigger);

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
        <h2 className={sharedStyles.sectionTitle} ref={titleRef}>
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
                    />
                  ) : (
                    <div className={styles.articleImagePlaceholder} />
                  )}
                  <Flex direction="column" gap="400">
                    <p className={styles.articleDate}>{article.date}</p>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
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
