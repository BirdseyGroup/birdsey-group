"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { clsx } from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./performanceSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: string;
  label: string;
}

interface PerformanceSectionProps {
  title: string;
  stats: Stat[];
}

export function PerformanceSection({ title, stats }: PerformanceSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

      // Animate stats with stagger
      gsap.from(statsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Section className={styles.performance}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={sharedStyles.sectionTitle} ref={titleRef}>
          {title}
        </h2>
        <div className={styles.performanceInner} ref={statsRef}>
          <Flex container gap="600">
            {stats.map((stat, i) => (
              <FlexItem key={i} className={styles.performanceItem}>
                <Flex direction="column" gap="400" alignSecondary="center">
                  <h3 className={sharedStyles.subtitle}>{stat.value}</h3>
                  <div className={sharedStyles.divider} />
                  <p
                    className={clsx(
                      sharedStyles.subheading,
                      sharedStyles.subheadingUppercase,
                    )}
                  >
                    {stat.label}
                  </p>
                </Flex>
              </FlexItem>
            ))}
          </Flex>
        </div>
      </Flex>
    </Section>
  );
}
