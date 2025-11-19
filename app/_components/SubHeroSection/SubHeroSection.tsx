"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextSubheading, TextSubtitle } from "@/components/primitives";
import styles from "./subHeroSection.module.css";

interface SubHeroSectionProps {
  title: string;
  description: string;
}

export function SubHeroSection({ title, description }: SubHeroSectionProps) {
  return (
    <Section id="about" variant="brand" className={styles.subHero}>
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
        </FlexItem>
      </Flex>
    </Section>
  );
}
