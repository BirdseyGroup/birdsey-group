"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { Button, Input, Textarea } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./contactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  title: string;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
}

export function ContactSection({ title, formTitle, formDescription, submitButtonText }: ContactSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Animate form
      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Section id="contact" className={styles.contact}>
      <Flex container gap="600">
        <FlexItem size="major">
          <h2 className={`${sharedStyles.sectionTitle} ${styles.contactTitle}`} ref={titleRef}>
            {title}
          </h2>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm} ref={formRef}>
            <form>
              <Flex direction="column" gap="600">
                <div className={styles.formHeader}>
                  <h3 className={styles.formTitle}>
                    {formTitle}
                  </h3>
                  <p>
                    {formDescription}
                  </p>
                </div>

                <Input placeholder="Name" required />
                <Input placeholder="Phone" type="tel" required />
                <Input placeholder="Email" type="email" required />
                <Input placeholder="Company" />
                <Textarea placeholder="Comments" required />

                <Button variant="primary" size="medium" type="submit">
                  {submitButtonText}
                </Button>
              </Flex>
            </form>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
