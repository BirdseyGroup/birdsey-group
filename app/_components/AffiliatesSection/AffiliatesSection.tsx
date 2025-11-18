"use client";

import { Flex, Section } from "@/components/layout";
import Image from "next/image";
import sharedStyles from "../shared.module.css";
import styles from "./affiliatesSection.module.css";

export function AffiliatesSection() {
  const logos = [
    "/images/affiliate-1.png",
    "/images/construction-logo.png",
    "/images/affiliate-2.png",
    "/images/affiliate-3.png",
    "/images/affiliate-4.png",
  ];

  return (
    <Section className={styles.affiliates}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={sharedStyles.sectionTitle}>From Capital to Completion</h2>
        <div className={styles.affiliatesLogos}>
          {logos.map((logo, i) => (
            <div key={i} className={styles.affiliateLogo}>
              <Image
                src={logo}
                alt={`Affiliate logo ${i + 1}`}
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
