"use client";

import { Flex, Section } from "@/components/layout";
import Image from "next/image";
import sharedStyles from "../shared.module.css";
import styles from "./affiliatesSection.module.css";

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
  items: Affiliate[];
}

export function AffiliatesSection({
  sectionTitle,
  items,
}: AffiliatesSectionProps) {
  return (
    <Section id="affiliates" className={styles.affiliates}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={sharedStyles.sectionTitle}>{sectionTitle}</h2>
        <div className={styles.affiliatesLogos}>
          {items.map((affiliate, i) => (
            <div key={i} className={styles.affiliateLogo}>
              <Image
                src={affiliate.logo}
                alt={`${affiliate.title} ${affiliate.subtitle}`}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </Flex>
    </Section>
  );
}
