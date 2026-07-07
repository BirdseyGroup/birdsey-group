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

// Forminit requires E.164 phone numbers (+14049613500) and validates them
// with libphonenumber server-side, which rejects unroutable numbers like the
// reserved 555 range. Visitors type US-style numbers, so normalize and apply
// basic NANP sanity checks before submitting to avoid a round-trip rejection.
function isValidNanp(tenDigits: string): boolean {
  const area = tenDigits.slice(0, 3);
  const exchange = tenDigits.slice(3, 6);
  // Area code and exchange must start 2-9 (NANP rule).
  if (!/^[2-9]/.test(area) || !/^[2-9]/.test(exchange)) return false;
  // 555 exchange is reserved/fictional (e.g. 555-555-5555).
  if (exchange === "555") return false;
  return true;
}

function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  // Non-US international numbers: trust the leading + and length.
  if (raw.trim().startsWith("+") && !digits.startsWith("1")) {
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  if (digits.length === 10) {
    return isValidNanp(digits) ? `+1${digits}` : null;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    const ten = digits.slice(1);
    return isValidNanp(ten) ? `+${digits}` : null;
  }
  return null;
}

interface ContactSectionProps {
  title: string;
  titleTinaField?: string;
  formTitle: string;
  formTitleTinaField?: string;
  formDescription: string;
  formDescriptionTinaField?: string;
  submitButtonText: string;
  submitButtonTextTinaField?: string;
}

export function ContactSection({
  title,
  titleTinaField,
  formTitle,
  formTitleTinaField,
  formDescription,
  formDescriptionTinaField,
  submitButtonText,
  submitButtonTextTinaField,
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
        // Forminit returns structured per-field validation errors. Surface the
        // ones we can map back to a field inline; fall back to the generic
        // banner for anything else (network, rate limit, server errors).
        const code = (error as { error?: string }).error;
        if (code === "FI_RULES_PHONE_INVALID") {
          setState({
            status: "error",
            message: "Please correct the highlighted fields.",
            fieldErrors: { phone: "Enter a valid, reachable phone number" },
          });
        } else if (code === "FI_RULES_EMAIL_INVALID") {
          setState({
            status: "error",
            message: "Please correct the highlighted fields.",
            fieldErrors: { email: "Enter a valid email address" },
          });
        } else {
          setState({
            status: "error",
            message:
              "Couldn't send your message. Please try again or email mail@birdseygroup.com.",
          });
        }
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
              data-tina-field={titleTinaField}
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
                    <h3
                      className={styles.formTitle}
                      data-tina-field={formTitleTinaField}
                    >
                      {formTitle}
                    </h3>
                    <p data-tina-field={formDescriptionTinaField}>
                      {formDescription}
                    </p>
                  </div>

                  <div className={styles.fieldGroup}>
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
                  </div>

                  <div className={styles.fieldGroup}>
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
                  </div>

                  <div className={styles.fieldGroup}>
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
                  </div>

                  <Input
                    name="fi-sender-company"
                    placeholder="Company (optional)"
                    aria-label="Company (optional)"
                  />

                  <div className={styles.fieldGroup}>
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
                  </div>

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
                    className={pending ? styles.submitPending : undefined}
                    data-tina-field={submitButtonTextTinaField}
                  >
                    {pending ? (
                      <>
                        <span className={styles.spinner} aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </Button>
                </Flex>
            </form>
          </div>
        </FlexItem>
      </Flex>
    </Section>
  );
}
