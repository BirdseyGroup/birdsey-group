"use client";

import { Section } from "@/components/layout";
import { Button, ButtonGroup } from "@/components/primitives";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./heroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
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
        <h1 className={styles.heroTitle}>
          The Standard of Excellence in Real Estate Investment Services.
        </h1>
        <p className={styles.heroSubtitle}>
          One ecosystem. Trusted expertise. Results from capital to completion.
        </p>
        <ButtonGroup>
          <Button variant="primary" size="medium">
            Explore our expertise
          </Button>
          <Button variant="neutral" size="medium">
            Meet the affiliates
          </Button>
        </ButtonGroup>
      </div>
    </Section>
  );
}
