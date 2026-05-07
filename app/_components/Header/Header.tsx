"use client";

import { useNavigation } from "@/app/_contexts/NavigationContext";
import { Flex, FlexItem, Section } from "@/components/layout";
import { Navigation, NavigationPill } from "@/components/primitives";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./header.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems: NavItem[];
}

export function Header({ navItems }: HeaderProps) {
  const { activePage, setActivePage } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 72; // Height of fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);

    // If it's the About page link
    if (href === "/about") {
      setActivePage("about");
      router.push("/about");
      return;
    }

    // If it's a hash link (section on homepage)
    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      setActivePage(id);

      // If we're not already on the homepage, navigate there first
      if (pathname !== "/") {
        router.push(`/${href}`);
      } else {
        scrollToSection(id);
      }
    }
  };

  const handleLogoClick = () => {
    setActivePage("home");
    setMobileMenuOpen(false);

    if (pathname !== "/") {
      router.push("/");
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Section elementType="header" variant="brand" className={styles.header}>
      <Flex container alignPrimary="space-between" alignSecondary="center">
        <FlexItem size="minor">
          <div
            className={styles.logoWrapper}
            onClick={handleLogoClick}
          >
            <Image src="/images/birdsey-logo.svg" alt="Birdsey Group" fill />
          </div>
        </FlexItem>
        <FlexItem size="major">
          <Flex gap="400" alignPrimary="end" alignSecondary="center">
            <Navigation direction="row" className={styles.desktopNav}>
              {navItems.map((item) => {
                const isAboutLink = item.href === "/about";
                const isSelected = isAboutLink
                  ? pathname === "/about"
                  : activePage === item.href.replace("#", "");

                return (
                  <NavigationPill
                    key={item.label}
                    onPress={() => handleNavClick(item.href)}
                    isSelected={isSelected}
                    className={styles.navigationPill}
                  >
                    {item.label}
                  </NavigationPill>
                );
              })}
            </Navigation>
            <button
              className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
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
            {navItems.map((item) => {
              const isAboutLink = item.href === "/about";
              const isSelected = isAboutLink
                ? pathname === "/about"
                : activePage === item.href.replace("#", "");

              return (
                <NavigationPill
                  key={item.label}
                  onPress={() => handleNavClick(item.href)}
                  isSelected={isSelected}
                  className={styles.mobileNavigationPill}
                >
                  {item.label}
                </NavigationPill>
              );
            })}
          </Navigation>
        </div>
      )}
    </Section>
  );
}
