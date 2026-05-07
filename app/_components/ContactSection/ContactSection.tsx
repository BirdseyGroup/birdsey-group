"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { Button, Input, Textarea } from "@/components/primitives";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  sendContact,
  type ContactFormState,
} from "../../_actions/sendContact";
import sharedStyles from "../shared.module.css";
import styles from "./contactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const initialState: ContactFormState = { status: "idle" };

interface ContactSectionProps {
  title: string;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="primary"
      size="medium"
      type="submit"
      isDisabled={pending}
    >
      {pending ? "Sending…" : label}
    </Button>
  );
}

export function ContactSection({
  title,
  formTitle,
  formDescription,
  submitButtonText,
}: ContactSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const formElRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(sendContact, initialState);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (state.status === "success") {
      setShowForm(false);
      formElRef.current?.reset();
    }
  }, [state]);

  useEffect(() => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (
        trigger.trigger === titleRef.current ||
        trigger.trigger === formRef.current
      ) {
        trigger.kill();
      }
    });

    const ctx = gsap.context(() => {
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

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const fieldError =
    state.status === "error" ? state.fieldErrors : undefined;

  return (
    <Section id="contact" className={styles.contact}>
      <Flex container gap="600">
        <FlexItem size="major">
          <h2
            className={`${sharedStyles.sectionTitle} ${styles.contactTitle}`}
            ref={titleRef}
          >
            {title}
          </h2>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm} ref={formRef}>
            {showForm ? (
              <form ref={formElRef} action={formAction} noValidate>
                <Flex direction="column" gap="600">
                  <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>{formTitle}</h3>
                    <p>{formDescription}</p>
                  </div>

                  <Input
                    name="name"
                    placeholder="Name"
                    aria-label="Name"
                    required
                    aria-invalid={Boolean(fieldError?.name)}
                  />
                  {fieldError?.name && (
                    <p className={styles.fieldError}>{fieldError.name}</p>
                  )}

                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone"
                    aria-label="Phone"
                    required
                    aria-invalid={Boolean(fieldError?.phone)}
                  />
                  {fieldError?.phone && (
                    <p className={styles.fieldError}>{fieldError.phone}</p>
                  )}

                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    required
                    aria-invalid={Boolean(fieldError?.email)}
                  />
                  {fieldError?.email && (
                    <p className={styles.fieldError}>{fieldError.email}</p>
                  )}

                  <Input
                    name="company"
                    placeholder="Company"
                    aria-label="Company"
                  />

                  <Textarea
                    name="comments"
                    placeholder="Comments"
                    aria-label="Comments"
                    required
                    aria-invalid={Boolean(fieldError?.comments)}
                  />
                  {fieldError?.comments && (
                    <p className={styles.fieldError}>{fieldError.comments}</p>
                  )}

                  {state.status === "error" && !state.fieldErrors && (
                    <div
                      role="alert"
                      className={`${styles.formStatus} ${styles.formStatusError}`}
                    >
                      {state.message}
                    </div>
                  )}

                  <SubmitButton label={submitButtonText} />
                </Flex>
              </form>
            ) : (
              <div
                role="status"
                className={`${styles.formStatus} ${styles.formStatusSuccess} ${styles.successPanel}`}
              >
                <h3 className={styles.formTitle}>Thank you.</h3>
                <p>
                  Your message has been sent. A member of the Birdsey team
                  will be in touch shortly.
                </p>
                <Button
                  variant="neutral"
                  size="medium"
                  onPress={() => setShowForm(true)}
                >
                  Send another message
                </Button>
              </div>
            )}
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
