"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./performanceSection.module.css";

export function PerformanceSection() {
  const items = [
    { title: "$XB+", description: "Assets managed" },
    { title: "25+", description: "Years" },
    { title: "5", description: "Affiliates" },
    { title: "Nationwide", description: "Reach" },
  ];

  return (
    <Section className={styles.performance}>
      <Flex direction="column" gap="1200" alignSecondary="center">
        <h2 className={sharedStyles.sectionTitle}>Performance that Build Trust</h2>
        <Flex container gap="600">
          {items.map((item, i) => (
            <FlexItem key={i}>
              <Flex direction="column" gap="400" alignSecondary="center">
                <h3 className={sharedStyles.subtitle}>{item.title}</h3>
                <div className={sharedStyles.divider} />
                <p className={sharedStyles.subheading}>{item.description}</p>
              </Flex>
            </FlexItem>
          ))}
        </Flex>
      </Flex>
    </Section>
  );
}
