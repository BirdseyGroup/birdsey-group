"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./subHeroSection.module.css";

export function SubHeroSection() {
  return (
    <Section variant="brand" className={styles.subHero}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem>
          <h2 className={`${sharedStyles.subtitle} ${styles.subtitle}`}>
            The Birdsey Standard
          </h2>
        </FlexItem>
        <FlexItem size="major">
          <p className={`${sharedStyles.subheading} ${styles.subheading}`}>
            Building relationships. Bringing discipline to execution. Every
            Birdsey affiliate operates under the same promise: Quality, Urgency,
            Accountability, Resilience, Transparency.
          </p>
        </FlexItem>
      </Flex>
    </Section>
  );
}
