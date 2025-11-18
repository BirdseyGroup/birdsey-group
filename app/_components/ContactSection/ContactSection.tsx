"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { Button, Input, Textarea } from "@/components/primitives";
import sharedStyles from "../shared.module.css";
import styles from "./contactSection.module.css";

export function ContactSection() {
  return (
    <Section className={styles.contact}>
      <Flex container gap="600" alignSecondary="start">
        <FlexItem size="major">
          <h2 className={sharedStyles.sectionTitle}>
            Let's Move Real Estate Forward.
          </h2>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm}>
            <Flex direction="column" gap="600">
              <div className={styles.formHeader}>
                <div className={styles.formAccent} />
                <h3 className={styles.formTitle}>
                  Thank you for your interest in Birdsey.
                </h3>
                <p>
                  Please complete the form below, and we will get back with you
                  as soon as possible.
                </p>
              </div>

              <Input placeholder="Name" />
              <Input placeholder="Phone" />
              <Input placeholder="Email" />
              <Input placeholder="Company" />
              <Textarea placeholder="Comments" />

              <Button variant="primary" size="medium">
                SUBMIT
              </Button>
            </Flex>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
