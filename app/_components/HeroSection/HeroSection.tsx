"use client";

import { Section } from "@/components/layout";
import { Button, ButtonGroup } from "@/components/primitives";
import styles from "./heroSection.module.css";

export function HeroSection() {
  return (
    <Section variant="brand" className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          The Standard of Excellence in Real Estate Investment Services.
        </h1>
        <p className={styles.heroSubtitle}>
          One ecosystem. Trusted expertise. Results from capital to completion.
        </p>
        <ButtonGroup>
          <Button variant="primary" size="medium">
            Explore our expertise
          </Button>
          <Button variant="neutral" size="medium">
            Meet the affiliates
          </Button>
        </ButtonGroup>
      </div>
    </Section>
  );
}
