"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextSubheading, TextSubtitle } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./subHeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface SubHeroLink {
  text?: string;
  href?: string;
}

interface SubHeroSectionProps {
  title: string;
  description: string;
  link?: SubHeroLink;
}

export function SubHeroSection({ title, description, link }: SubHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Kill any existing ScrollTriggers for this element
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === sectionRef.current) {
        trigger.kill();
      }
    });

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

    return () => {
      ctx.revert();
      // Refresh ScrollTrigger after cleanup
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Section id="about" variant="brand" className={styles.subHero}>
      <div ref={sectionRef}>
        <Flex container gap="600" alignSecondary="center">
          <FlexItem>
            <TextSubtitle elementType="h2" className={styles.subtitle}>
              {title}
            </TextSubtitle>
          </FlexItem>
          <FlexItem size="major">
            <TextSubheading className={styles.subheading}>
              {description}
            </TextSubheading>
            {link?.href && link?.text && (
              <Link href={link.href} className={styles.link}>
                {link.text}
                <span aria-hidden="true" className={styles.linkArrow}>
                  →
                </span>
              </Link>
            )}
          </FlexItem>
        </Flex>
      </div>
    </Section>
  );
}
