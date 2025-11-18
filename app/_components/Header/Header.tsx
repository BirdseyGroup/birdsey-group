"use client";

import { IconSearch } from "@/components/icons";
import { Flex, FlexItem, Section } from "@/components/layout";
import { Navigation, NavigationPill } from "@/components/primitives";
import Image from "next/image";
import { useState } from "react";
import styles from "./header.module.css";

export function Header() {
  const [activePage, setActivePage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Affiliates", href: "#affiliates" },
    { label: "News", href: "#news" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    setActivePage(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Section elementType="header" variant="brand" className={styles.header}>
      <Flex container alignPrimary="space-between" alignSecondary="center">
        <FlexItem size="minor">
          <div style={{ position: "relative", width: "99px", height: "40px" }}>
            <Image
              src="/images/birdsey-group-logo.svg"
              alt="Birdsey Group"
              fill
            />
          </div>
        </FlexItem>
        <FlexItem size="major">
          <Flex gap="400" alignPrimary="end" alignSecondary="center">
            <Navigation direction="row" className={styles.desktopNav}>
              {navItems.map((item) => (
                <NavigationPill
                  key={item.label}
                  onPress={() => handleNavClick(item.href)}
                  isSelected={activePage === item.href.replace("#", "")}
                  className={styles.navigationPill}
                >
                  {item.label}
                </NavigationPill>
              ))}
            </Navigation>
            <IconSearch className={styles.searchIcon} />
            <button
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </button>
          </Flex>
        </FlexItem>
      </Flex>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Navigation direction="column">
            {navItems.map((item) => (
              <NavigationPill
                key={item.label}
                onPress={() => handleNavClick(item.href)}
                isSelected={activePage === item.href.replace("#", "")}
                className={styles.mobileNavigationPill}
              >
                {item.label}
              </NavigationPill>
            ))}
          </Navigation>
        </div>
      )}
    </Section>
  );
}
