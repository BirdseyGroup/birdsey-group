"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./careersSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface CareersSectionProps {
  title: string;
  content: string;
  email: string;
  image?: string;
}

export function CareersSection({ title, content, email }: CareersSectionProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image
      gsap.from(imageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate content
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Section id="careers" className={styles.careers}>
      <Flex container gap="1200" alignSecondary="center">
        <FlexItem size="major">
          <div className={styles.imageContainer} ref={imageRef}>
            <Image
              src="/images/birdsey-board-room-with-city-views.jpg"
              alt="Birdsey Group Office"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </FlexItem>
        <FlexItem size="major">
          <div ref={contentRef}>
            <Flex direction="column" gap="400">
              <h2 className={sharedStyles.subtitle}>{title}</h2>
              <div className={sharedStyles.divider} />
              <div className={styles.careersText}>
                {content.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <p>
                  <a href={`mailto:${email}`} className={styles.emailLink}>
                    {email}
                  </a>
                </p>
              </div>
            </Flex>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
