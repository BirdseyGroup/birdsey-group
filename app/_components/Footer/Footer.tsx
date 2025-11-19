"use client";

import { Flex, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import Image from "next/image";
import styles from "./footer.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface FooterProps {
  phone: string;
  email: string;
  address: string;
  copyright: string;
  navItems: NavItem[];
}

export function Footer({ phone, email, address, copyright, navItems }: FooterProps) {
  return (
    <Section elementType="footer" variant="brand" className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Company</h3>
            <Flex direction="column" gap="200">
              {navItems.map((item, i) => (
                <TextLink key={i} href={item.href} className={styles.navigationPill}>
                  {item.label}
                </TextLink>
              ))}
            </Flex>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <Flex direction="column" gap="200">
              <TextLink
                href={`tel:${phone}`}
                className={styles.navigationPill}
              >
                {phone}
              </TextLink>
              <TextLink
                href={`mailto:${email}`}
                className={styles.navigationPill}
              >
                {email}
              </TextLink>
              <TextLink href="#contact" className={styles.navigationPill}>
                Contact Form
              </TextLink>
            </Flex>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Location</h3>
            <p className={styles.footerText}>
              {address.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < address.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
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
              {copyright.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < copyright.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </Flex>
        </div>
      </div>
    </Section>
  );
}
