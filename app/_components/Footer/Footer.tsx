"use client";

import { Flex, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import { useNavigation } from "@/app/_contexts/NavigationContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { scrollToSection } from "../scrollToSection";
import { OPEN_COOKIE_SETTINGS_EVENT } from "../CookieConsent";
import styles from "./footer.module.css";

interface NavItem {
  label: string;
  href: string;
}

interface FooterLink extends NavItem {
  openCookieSettings?: boolean;
}

interface FooterProps {
  phone: string;
  email: string;
  address: string;
  copyright: string;
  navItems: NavItem[];
  footerNavExtras?: NavItem[];
  footerLinks?: FooterLink[];
}

export function Footer({ phone, email, address, copyright, navItems, footerNavExtras = [], footerLinks = [] }: FooterProps) {
  const { activePage, setActivePage } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Route link (not a hash anchor)
    if (!href.startsWith("#")) {
      const pageKey = href.replace(/^\//, "") || "home";
      setActivePage(pageKey);
      router.push(href);
      return;
    }

    // Hash link — scroll to section on homepage
    const id = href.replace("#", "");
    setActivePage(id);

    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <Section elementType="footer" variant="brand" className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Company</h3>
            <Flex direction="column" gap="200">
              {[...navItems, ...footerNavExtras].map((item, i) => {
                const isRouteLink = !item.href.startsWith("#");
                const isSelected = isRouteLink
                  ? pathname === item.href
                  : activePage === item.href.replace("#", "");

                return (
                  <TextLink
                    key={i}
                    href={item.href}
                    className={styles.navigationPill}
                    onClick={(e) => handleNavClick(item.href, e)}
                    data-selected={isSelected ? "" : undefined}
                  >
                    {item.label}
                  </TextLink>
                );
              })}
            </Flex>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <Flex direction="column" gap="200">
              <TextLink
                href={`tel:+1${phone.replace(/\D/g, "")}`}
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
            </Flex>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Location</h3>
            <a
              href="https://www.google.com/maps/place/3565+Piedmont+Rd+NE+Bldg+4,+Suite+460,+Atlanta,+GA+30305/data=!4m2!3m1!1s0x88f50f6131bfffff:0x6e1e3a3c9654cd9b?sa=X&ved=1t:242&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.footerText} ${styles.addressLink}`}
            >
              {address.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < address.split('\n').length - 1 && <br />}
                </span>
              ))}
            </a>
          </Flex>
        </div>

        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <div className={styles.award}>
              <div className={styles.awardBadge}>
                <Image
                  src="/images/Inc500_medallion.jpg"
                  alt="Inc. 500 — America's Fastest-Growing Private Companies"
                  width={72}
                  height={72}
                  className={styles.awardMedallion}
                />
              </div>
              <p className={`${styles.footerText} ${styles.awardCaption}`}>
                Recognized as the 6th fastest-growing construction company in
                the U.S.
              </p>
            </div>
            <div className={styles.footerLogo}>
              <Image
                src="/images/birdsey-group-logo.svg"
                alt="Birdsey Group"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Flex>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerText}>{copyright.split("\n").join(" ")}</p>
        {footerLinks.length > 0 && (
          <div className={styles.footerLinkRow}>
            {footerLinks.map((link, i) =>
              link.openCookieSettings ? (
                <button
                  key={i}
                  type="button"
                  className={styles.footerBottomLink}
                  onClick={() =>
                    window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))
                  }
                >
                  {link.label}
                </button>
              ) : (
                <a key={i} href={link.href} className={styles.footerBottomLink}>
                  {link.label}
                </a>
              )
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
