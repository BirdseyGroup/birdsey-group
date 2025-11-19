"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { Button, Input, Textarea } from "@/components/primitives";
import sharedStyles from "../shared.module.css";
import styles from "./contactSection.module.css";

interface ContactSectionProps {
  title: string;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
}

export function ContactSection({ title, formTitle, formDescription, submitButtonText }: ContactSectionProps) {
  return (
    <Section id="contact" className={styles.contact}>
      <Flex container gap="600" alignSecondary="center">
        <FlexItem size="major">
          <h2 className={sharedStyles.sectionTitle}>
            {title}
          </h2>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm}>
            <Flex direction="column" gap="600">
              <div className={styles.formHeader}>
                <div className={styles.formAccent} />
                <h3 className={styles.formTitle}>
                  {formTitle}
                </h3>
                <p>
                  {formDescription}
                </p>
              </div>

              <Input placeholder="Name" />
              <Input placeholder="Phone" />
              <Input placeholder="Email" />
              <Input placeholder="Company" />
              <Textarea placeholder="Comments" />

              <Button variant="primary" size="medium">
                {submitButtonText}
              </Button>
            </Flex>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
