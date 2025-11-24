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
  backgroundImage?: string;
  primaryButton?: {
    text?: string | null;
    href?: string | null;
  } | null;
  secondaryButton?: {
    text?: string | null;
    href?: string | null;
  } | null;
  variant?: "default" | "simple";
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage,
  primaryButton,
  secondaryButton,
  variant = "default",
}: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const hasButtons = primaryButton?.text || secondaryButton?.text;
  const isSimple = variant === "simple";

  useEffect(() => {
    if (!contentRef.current || isSimple) return;

    // Kill any existing ScrollTriggers for this element
    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.trigger === contentRef.current ||
        trigger.trigger === heroContainerRef.current
      ) {
        trigger.kill();
      }
    });

    const createAnimations = () => {
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

        // Create a wrapper timeline for the scroll-triggered fade out
        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top top",
            end: "+=600",
            scrub: 1,
          },
        });

        // Animate each child element fading out and scaling down
        scrollTimeline
          .to(titleRef.current, { opacity: 0, y: -30, scale: 0.8, ease: "none" }, 0)
          .to(subtitleRef.current, { opacity: 0, y: -30, scale: 0.8, ease: "none" }, 0)
          .to(buttonsRef.current, { opacity: 0, y: -30, scale: 0.8, ease: "none" }, 0);

        // Background zoom effect on scroll - zoom in from 110% to 130%
        if (heroContainerRef.current) {
          const isMobile = window.matchMedia("(max-width: 768px)").matches;

          gsap.fromTo(
            heroContainerRef.current,
            {
              backgroundSize: isMobile ? "cover" : "110%",
            },
            {
              backgroundSize: isMobile ? "cover" : "130%",
              ease: "none",
              scrollTrigger: {
                trigger: heroContainerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            }
          );
        }
      }, contentRef);

      return ctx;
    };

    let ctx = createAnimations();

    // Handle window resize with debouncing to refresh animations
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (
            trigger.trigger === contentRef.current ||
            trigger.trigger === heroContainerRef.current
          ) {
            trigger.kill();
          }
        });
        ctx = createAnimations();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [isSimple]);

  const heroStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined;

  return (
    <Section
      variant="brand"
      className={`${styles.hero} ${isSimple ? styles.heroSimple : ""}`}
    >
      <div
        className={styles.heroContent}
        ref={heroContainerRef}
        style={heroStyle}
      >
        <div ref={contentRef} className={styles.heroContentInner}>
          <h1 className={styles.heroTitle} ref={titleRef}>
            {title}
          </h1>
          <p className={styles.heroSubtitle} ref={subtitleRef}>
            {subtitle}
          </p>
          {hasButtons && (
            <div ref={buttonsRef} className={styles.heroButtonGroup}>
              <ButtonGroup align="stack">
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
          )}
        </div>
      </div>
    </Section>
  );
}
