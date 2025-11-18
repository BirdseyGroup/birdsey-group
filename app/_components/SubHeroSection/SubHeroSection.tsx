"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextSubheading, TextSubtitle } from "@/components/primitives";
import styles from "./subHeroSection.module.css";

export function SubHeroSection() {
  return (
    <Section id="about" variant="brand" className={styles.subHero}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem>
          <TextSubtitle elementType="h2" className={styles.subtitle}>
            The Birdsey Standard
          </TextSubtitle>
        </FlexItem>
        <FlexItem size="major">
          <TextSubheading className={styles.subheading}>
            Building relationships. Bringing discipline to execution. Every
            Birdsey affiliate operates under the same promise: Quality, Urgency,
            Accountability, Resilience, Transparency.
          </TextSubheading>
        </FlexItem>
      </Flex>
    </Section>
  );
}
