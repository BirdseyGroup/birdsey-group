"use client";

import { Flex, Section } from "@/components/layout";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./affiliatesSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Affiliate {
  title: string;
  subtitle: string;
  description: string;
  logo: string;
  slideImage: string;
  website: string;
}

interface AffiliatesSectionProps {
  sectionTitle: string;
  sectionTitleTinaField?: string;
  items: Affiliate[];
  itemsTinaFields?: Array<{ logo?: string }>;
}

export function AffiliatesSection({
  sectionTitle,
  sectionTitleTinaField,
  items,
  itemsTinaFields,
}: AffiliatesSectionProps) {
  const logoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Kill any existing ScrollTriggers for logo elements
    ScrollTrigger.getAll().forEach((trigger) => {
      if (logoRefs.current.includes(trigger.trigger as HTMLDivElement | null)) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Set initial state for all logos
      logoRefs.current.forEach((logo) => {
        if (logo) {
          gsap.set(logo, { opacity: 0, y: 20 });
        }
      });

      // Animate logos sequentially when they come into view
      logoRefs.current.forEach((logo, index) => {
        if (logo) {
          gsap.to(logo, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: logo,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [items.length]);

  return (
    <Section id="affiliates" className={styles.affiliates}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2
          className={sharedStyles.sectionTitle}
          data-tina-field={sectionTitleTinaField}
        >
          {sectionTitle}
        </h2>
        <div className={styles.affiliatesLogos}>
          {items.map((affiliate, i) => (
            <div
              key={i}
              className={styles.affiliateLogo}
              ref={(el) => {
                logoRefs.current[i] = el;
              }}
            >
              <a
                href={affiliate.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.affiliateLink}
                data-tina-field={itemsTinaFields?.[i]?.logo}
              >
                <Image
                  src={affiliate.logo}
                  alt={`${affiliate.title} ${affiliate.subtitle}`}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </a>
            </div>
          ))}
        </div>
      </Flex>
    </Section>
  );
}
