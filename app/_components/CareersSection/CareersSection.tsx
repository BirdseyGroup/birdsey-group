"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import sharedStyles from "../shared.module.css";
import styles from "./careersSection.module.css";

interface CareersSectionProps {
  title: string;
  content: string;
  email: string;
  image?: string;
}

export function CareersSection({ title, content, email }: CareersSectionProps) {
  return (
    <Section id="careers" className={styles.careers}>
      <Flex container gap="1200" alignSecondary="center">
        <FlexItem size="major">
          <div className={sharedStyles.imagePlaceholder} />
        </FlexItem>
        <FlexItem size="major">
          <Flex direction="column" gap="400">
            <h2 className={sharedStyles.subtitle}>{title}</h2>
            <div className={sharedStyles.divider} />
            <div className={styles.careersText}>
              {content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p>
                <a
                  href={`mailto:${email}`}
                  className={styles.emailLink}
                >
                  <strong>{email}</strong>
                </a>
              </p>
            </div>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
