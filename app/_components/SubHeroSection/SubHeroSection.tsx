"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { TextSubheading, TextSubtitle } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./subHeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface SubHeroLink {
  text?: string;
  href?: string;
}

interface SubHeroPostReference {
  title: string;
  _sys: { filename: string };
}

function filenameToTitle(path: string) {
  const slug = path.split("/").pop()?.replace(/\.json$/, "") ?? path;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// A SubHero link can point at a manually-entered URL, or at an Insights
// article picked via a reference field — the reference wins when set. Shared
// between the Home Page (app/_components/HomePageContent) and custom Pages
// blocks (app/_components/PageSections) so both resolve it identically.
//
// While actively editing in the live preview, Tina patches a reference
// field with the raw, unresolved file path (a string) rather than the full
// referenced document — only a saved-and-requeried page gets the resolved
// object — so `postReference` here can be either shape.
export function resolveSubHeroLink({
  link,
  postReference,
  linkTextTinaField,
  postReferenceTinaField,
}: {
  link?: { text?: string | null; href?: string | null } | null;
  postReference?: SubHeroPostReference | string | null;
  linkTextTinaField?: string;
  postReferenceTinaField?: string;
}): { link?: SubHeroLink; tinaField?: string } {
  if (typeof postReference === "string") {
    const filename = postReference.split("/").pop()?.replace(/\.json$/, "");
    return {
      link: {
        text: link?.text || `Read: ${filenameToTitle(postReference)}`,
        href: filename ? `/insights/${filename}` : undefined,
      },
      tinaField: link?.text ? linkTextTinaField : postReferenceTinaField,
    };
  }

  if (postReference) {
    return {
      link: {
        text: link?.text || `Read: ${postReference.title}`,
        href: `/insights/${postReference._sys.filename}`,
      },
      tinaField: link?.text ? linkTextTinaField : postReferenceTinaField,
    };
  }

  if (link) {
    return {
      link: {
        text: link.text ?? undefined,
        href: link.href ?? undefined,
      },
      tinaField: linkTextTinaField,
    };
  }

  return {};
}

interface SubHeroSectionProps {
  title: string;
  titleTinaField?: string;
  description: string;
  descriptionTinaField?: string;
  link?: SubHeroLink;
  linkTextTinaField?: string;
}

export function SubHeroSection({
  title,
  titleTinaField,
  description,
  descriptionTinaField,
  link,
  linkTextTinaField,
}: SubHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Kill any existing ScrollTriggers for this element
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === sectionRef.current) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      // Refresh ScrollTrigger after cleanup
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <Section id="about" variant="brand" className={styles.subHero}>
      <div ref={sectionRef}>
        <Flex container gap="600" alignSecondary="center">
          <FlexItem>
            <TextSubtitle
              elementType="h2"
              className={styles.subtitle}
              data-tina-field={titleTinaField}
            >
              {title}
            </TextSubtitle>
          </FlexItem>
          <FlexItem size="major">
            <TextSubheading
              className={styles.subheading}
              data-tina-field={descriptionTinaField}
            >
              {description}
            </TextSubheading>
            {link?.href && link?.text && (
              <Link
                href={link.href}
                className={styles.link}
                data-tina-field={linkTextTinaField}
              >
                {link.text}
                <span aria-hidden="true" className={styles.linkArrow}>
                  →
                </span>
              </Link>
            )}
          </FlexItem>
        </Flex>
      </div>
    </Section>
  );
}
