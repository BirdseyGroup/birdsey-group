"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextSubheading, TextSubtitle } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import styles from "./subHeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface SubHeroSectionProps {
  title: string;
  description: string;
}

export function SubHeroSection({ title, description }: SubHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section id="about" variant="brand" className={styles.subHero}>
      <Flex container gap="600" alignSecondary="center" ref={sectionRef}>
        <FlexItem>
          <TextSubtitle elementType="h2" className={styles.subtitle}>
            {title}
          </TextSubtitle>
        </FlexItem>
        <FlexItem size="major">
          <TextSubheading className={styles.subheading}>
            {description}
          </TextSubheading>
        </FlexItem>
      </Flex>
    </Section>
  );
}
