"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextLink, TextLinkList, TextListItem } from "@/components/primitives";
import Image from "next/image";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <Section elementType="footer" variant="brand" className={styles.footer}>
      <Flex container gap="600">
        <FlexItem size="equal">
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Company</h3>
            <TextLinkList density="tight">
              <TextListItem>
                <TextLink href="#">Home</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">About</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">Affiliates</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">News</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">Careers</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">Contact</TextLink>
              </TextListItem>
            </TextLinkList>
          </Flex>
        </FlexItem>

        <FlexItem size="equal">
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <TextLinkList density="tight">
              <TextListItem>
                <TextLink href="tel:404-961-3500">404-961-3500</TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="mailto:mail@birdseygroup.com">
                  mail@birdseygroup.com
                </TextLink>
              </TextListItem>
              <TextListItem>
                <TextLink href="#">Contact Form</TextLink>
              </TextListItem>
            </TextLinkList>
          </Flex>
        </FlexItem>

        <FlexItem size="equal">
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

        <FlexItem size="equal">
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
