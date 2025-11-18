"use client";

import { IconSearch } from "@/components/icons";
import { Flex, FlexItem, Section } from "@/components/layout";
import { Navigation, NavigationPill } from "@/components/primitives";
import Image from "next/image";
import { useState } from "react";
import styles from "./birdsey.module.css";

export function Header() {
  const [activePage, setActivePage] = useState("home");

  const navItems = [
    "Home",
    "About",
    "Services",
    "Affiliates",
    "News",
    "Careers",
    "Contact",
  ];

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
            <Navigation direction="row">
              {navItems.map((item) => (
                <NavigationPill
                  key={item}
                  onPress={() => setActivePage(item.toLowerCase())}
                  isSelected={activePage === item.toLowerCase()}
                  className={styles.navigationPill}
                >
                  {item}
                </NavigationPill>
              ))}
            </Navigation>
            <IconSearch className={styles.searchIcon} />
          </Flex>
        </FlexItem>
      </Flex>
    </Section>
  );
}
