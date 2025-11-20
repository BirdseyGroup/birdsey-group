"use client";

import { Section } from "@/components/layout";
import { Button, ButtonGroup } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import styles from "./heroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButton?: {
    text?: string | null;
    href?: string | null;
  } | null;
  secondaryButton?: {
    text?: string | null;
    href?: string | null;
  } | null;
}

export function HeroSection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
}: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      // Initial fade-in timeline for hero elements
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Set initial states
      gsap.set(contentRef.current, { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0, y: 30 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 30 });
      gsap.set(buttonsRef.current, { opacity: 0, y: 30 });

      // Sequential fade-in animation
      tl.to(contentRef.current, {
        opacity: 1,
        duration: 1.2,
        delay: 0.2,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      // Animate hero section height shrinking
      gsap.to(contentRef.current, {
        minHeight: "400px",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Animate content fade out
      gsap.to(contentRef.current?.children || [], {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <Section variant="brand" className={styles.hero}>
      <div className={styles.heroContent} ref={contentRef}>
        <h1 className={styles.heroTitle} ref={titleRef}>
          {title}
        </h1>
        <p className={styles.heroSubtitle} ref={subtitleRef}>
          {subtitle}
        </p>
        <ButtonGroup
          align="stack"
          className={styles.heroButtonGroup}
          ref={buttonsRef}
        >
          {primaryButton?.text && (
            <Button
              variant="primary"
              size="medium"
              href={primaryButton.href || undefined}
            >
              {primaryButton.text}
            </Button>
          )}
          {secondaryButton?.text && (
            <Button
              variant="neutral"
              size="medium"
              href={secondaryButton.href || undefined}
            >
              {secondaryButton.text}
            </Button>
          )}
        </ButtonGroup>
      </div>
    </Section>
  );
}
