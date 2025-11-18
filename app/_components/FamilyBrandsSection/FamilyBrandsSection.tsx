"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./familyBrandsSection.module.css";

export function FamilyBrandsSection() {
  return (
    <Section className={styles.family}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem size="major">
          <div className={sharedStyles.imagePlaceholder} />
        </FlexItem>
        <FlexItem size="major">
          <Flex direction="column" gap="400" alignSecondary="center">
            <h2 className={sharedStyles.subtitle}>
              Build with Certainty. Deliver with Discipline.
            </h2>
            <div className={sharedStyles.divider} />
            <p className={sharedStyles.subheading}>
              Turns vision into performance through expert project execution.
            </p>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
