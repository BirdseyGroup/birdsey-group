"use client";

import { Flex, FlexItem, Section } from "@/components/layout";
import { Button, Input, Textarea } from "@/components/primitives";
import { Forminit } from "forminit";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import sharedStyles from "../shared.module.css";
import styles from "./contactSection.module.css";

gsap.registerPlugin(ScrollTrigger);

// Forminit form (public auth mode — submissions go straight from the
// browser, no API key involved). Form IDs are not secrets.
const FORMINIT_FORM_ID = "d7bdapw3fcd";
const forminit = new Forminit();

type ContactFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const initialState: ContactFormState = { status: "idle" };

// Forminit requires E.164 phone numbers (+14049613500). Visitors type
// US-style numbers, so normalize before submitting.
function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

interface ContactSectionProps {
  title: string;
  formTitle: string;
  formDescription: string;
  submitButtonText: string;
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
  const router = useRouter();
  const [state, setState] = useState<ContactFormState>(initialState);
  const [pending, setPending] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const fields = {
      name: String(formData.get("fi-sender-fullName") ?? "").trim(),
      phone: String(formData.get("fi-sender-phone") ?? "").trim(),
      email: String(formData.get("fi-sender-email") ?? "").trim(),
      company: String(formData.get("fi-sender-company") ?? "").trim(),
      comments: String(formData.get("fi-text-comments") ?? "").trim(),
    };

    const fieldErrors: Record<string, string> = {};
    for (const key of ["name", "phone", "email", "comments"] as const) {
      if (!fields[key]) fieldErrors[key] = "Required";
    }
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      fieldErrors.email = "Enter a valid email address";
    }
    const e164Phone = fields.phone ? toE164(fields.phone) : null;
    if (fields.phone && !e164Phone) {
      fieldErrors.phone = "Enter a valid phone number";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setState({
        status: "error",
        message: "Please correct the highlighted fields.",
        fieldErrors,
      });
      return;
    }

    formData.set("fi-sender-fullName", fields.name);
    formData.set("fi-sender-phone", e164Phone as string);
    formData.set("fi-sender-email", fields.email);
    formData.set("fi-text-comments", fields.comments);
    if (!fields.company) formData.delete("fi-sender-company");

    setPending(true);
    try {
      const { error } = await forminit.submit(FORMINIT_FORM_ID, formData);

      if (error) {
        console.error("Forminit error:", error);
        setState({
          status: "error",
          message:
            "Couldn't send your message. Please try again or email mail@birdseygroup.com.",
        });
        setPending(false);
        return;
      }

      form.reset();
      router.push("/thank-you");
      // Leave `pending` true through the navigation so the button doesn't
      // flash back to its idle label before the page changes.
    } catch (err) {
      console.error("Contact form unexpected error:", err);
      setState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
      setPending(false);
    }
  }

  const fieldError =
    state.status === "error" ? state.fieldErrors : undefined;

  return (
    <Section id="contact" className={styles.contact}>
      <Flex container gap="600">
        <FlexItem size="major">
          <div className={styles.contactIntro}>
            <img
              src="/images/birdsey-icon-only.svg"
              alt=""
              aria-hidden="true"
              className={styles.contactWatermark}
            />
            <h2
              className={`${sharedStyles.sectionTitle} ${styles.contactTitle}`}
              ref={titleRef}
            >
              {title}
            </h2>
          </div>
        </FlexItem>
        <FlexItem>
          <div className={styles.contactForm} ref={formRef}>
            <form ref={formElRef} onSubmit={handleSubmit} noValidate>
                <Flex direction="column" gap="600">
                  <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>{formTitle}</h3>
                    <p>{formDescription}</p>
                  </div>

                  <Input
                    name="fi-sender-fullName"
                    placeholder="Name"
                    aria-label="Name"
                    required
                    aria-invalid={Boolean(fieldError?.name)}
                  />
                  {fieldError?.name && (
                    <p className={styles.fieldError}>{fieldError.name}</p>
                  )}

                  <Input
                    name="fi-sender-phone"
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
                    name="fi-sender-email"
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
                    name="fi-sender-company"
                    placeholder="Company"
                    aria-label="Company"
                  />

                  <Textarea
                    name="fi-text-comments"
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

                  <Button
                    variant="primary"
                    size="medium"
                    type="submit"
                    isDisabled={pending}
                  >
                    {pending ? "Sending…" : submitButtonText}
                  </Button>
                </Flex>
            </form>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
