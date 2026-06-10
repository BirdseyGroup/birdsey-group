"use client";

import { Flex, Section } from "@/components/layout";
import { TextLink } from "@/components/primitives";
import { useNavigation } from "@/app/_contexts/NavigationContext";
import { usePathname, useRouter } from "next/navigation";
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
  const { activePage, setActivePage } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavClick = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

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

      // If we're not on the homepage (about, team, insights pages), navigate home first
      if (pathname !== "/") {
        router.push("/");
        // Wait for navigation then scroll
        setTimeout(() => {
          scrollToSection(id);
        }, 100);
      } else {
        // Already on homepage, just scroll
        scrollToSection(id);
      }
    }
  };

  return (
    <Section elementType="footer" variant="brand" className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerColumn}>
          <Flex direction="column" gap="400">
            <h3 className={styles.footerHeading}>Company</h3>
            <Flex direction="column" gap="200">
              {navItems.map((item, i) => {
                const isAboutLink = item.href === "/about";
                const isSelected = isAboutLink
                  ? pathname === "/about"
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
              <TextLink
                href="#contact"
                className={styles.navigationPill}
                onClick={(e) => handleNavClick("#contact", e)}
                data-selected={activePage === "contact" ? "" : undefined}
              >
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
            <div
              className={styles.footerLogo}
              style={{ position: "relative", width: "99px", height: "40px" }}
            >
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
      </div>
    </Section>
  );
}
