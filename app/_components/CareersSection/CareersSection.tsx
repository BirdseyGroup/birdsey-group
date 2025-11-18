"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./careersSection.module.css";

export function CareersSection() {
  return (
    <Section className={styles.careers}>
      <Flex container gap="1200" alignSecondary="center">
        <FlexItem size="major">
          <div className={sharedStyles.imagePlaceholder} />
        </FlexItem>
        <FlexItem size="major">
          <Flex direction="column" gap="400">
            <h2 className={sharedStyles.subtitle}>Build Your Career on Trust.</h2>
            <div className={sharedStyles.divider} />
            <div className={styles.careersText}>
              <p>
                Every Birdsey company shares the same foundation: integrity,
                precision, and partnership. Whether you're managing assets,
                building projects, or structuring deals, you're part of
                something bigger.
              </p>
              <p>
                Join a team that values precision, partnership, and purpose.
              </p>
              <p>
                We are always interested in hearing from talented people. Send
                resume, cover letter, salary requirements and references to:
              </p>
              <p>
                <strong>careers@birdseygroup.com</strong>
              </p>
            </div>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
