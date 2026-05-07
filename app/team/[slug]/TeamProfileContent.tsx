"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LinkedInGlyph } from "../../_components/LinkedInGlyph";
import { renderTeamBio } from "./renderBio";
import styles from "./page.module.css";

interface TeamProfileContentProps {
  member: {
    name: string;
    title: string;
    photo?: string;
    bio?: any;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
  };
  affiliateName: string | null;
}

export function TeamProfileContent({
  member,
  affiliateName,
}: TeamProfileContentProps) {
  const bioRef = useRef<HTMLElement>(null);
  const [bioReady, setBioReady] = useState(false);

  useEffect(() => {
    const node = bioRef.current;
    if (!node) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setBioReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setBioReady(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const bioContent = renderTeamBio(member.bio);

  return (
    <>
      <Link href="/about" className={styles.backLink}>
        <span aria-hidden="true">←</span> Back to team
      </Link>

      <header className={styles.heroBlock}>
        <div
          className={`${styles.photoWrapper} ${styles.fadePhoto} ${
            !member.photo ? styles.photoWrapperPlaceholder : ""
          }`}
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              priority
              className={styles.photo}
            />
          ) : (
            <img
              src="/images/birdsey-icon-only-blue.svg"
              alt=""
              aria-hidden="true"
              className={styles.placeholderLogo}
            />
          )}
        </div>

        <div className={`${styles.heroText} ${styles.fadeHeroText}`}>
          {affiliateName && (
            <p className={styles.affiliate}>{affiliateName}</p>
          )}
          <h1 className={styles.name}>{member.name}</h1>
          <p className={styles.title}>{member.title}</p>

          {(member.email || member.phone || member.linkedinUrl) && (
            <ul className={styles.contactList}>
              {member.email && (
                <li>
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                </li>
              )}
              {member.phone && (
                <li>
                  <a href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}>
                    {member.phone}
                  </a>
                </li>
              )}
              {member.linkedinUrl && (
                <li>
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <LinkedInGlyph
                      size={18}
                      className={styles.linkedinIcon}
                    />
                    LinkedIn
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </header>

      {bioContent && (
        <article
          className={`${styles.bio} ${bioReady ? styles.bioReady : ""}`}
          ref={bioRef}
        >
          {bioContent}
        </article>
      )}
    </>
  );
}
