"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import Image from "next/image";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <Section elementType="footer" variant="brand" className={styles.footer}>
      <Flex container gap="600">
        <FlexItem className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Company</h3>
            <Flex direction="column" gap="200">
              <TextLink href="#" className={styles.navigationPill}>
                About
              </TextLink>
              <TextLink href="#" className={styles.navigationPill}>
                Affiliates
              </TextLink>
              <TextLink href="#" className={styles.navigationPill}>
                News
              </TextLink>
              <TextLink href="#" className={styles.navigationPill}>
                Careers
              </TextLink>
              <TextLink href="#" className={styles.navigationPill}>
                Contact
              </TextLink>
            </Flex>
          </Flex>
        </FlexItem>

        <FlexItem className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <Flex direction="column" gap="200">
              <TextLink
                href="tel:404-961-3500"
                className={styles.navigationPill}
              >
                404-961-3500
              </TextLink>
              <TextLink
                href="mailto:mail@birdseygroup.com"
                className={styles.navigationPill}
              >
                mail@birdseygroup.com
              </TextLink>
              <TextLink href="#" className={styles.navigationPill}>
                Contact Form
              </TextLink>
            </Flex>
          </Flex>
        </FlexItem>

        <FlexItem className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Location</h3>
            <p className={styles.footerText}>
              Corporate Office
              <br />
              3565 Piedmont Road N.E.
              <br />
              Piedmont Center | Building 4 | Suite 460
              <br />
              Atlanta, Georgia, 30305
            </p>
          </Flex>
        </FlexItem>

        <FlexItem className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <div
              style={{ position: "relative", width: "99px", height: "40px" }}
            >
              <Image
                src="/images/birdsey-group-logo.svg"
                alt="Birdsey Group"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className={styles.footerText}>
              The Birdsey Group LLC.
              <br />
              2025 - All Rights Reserved.
            </p>
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
