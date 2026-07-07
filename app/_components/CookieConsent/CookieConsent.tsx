"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "primitives";
import styles from "./cookieConsent.module.css";

const STORAGE_KEY = "birdsey-cookie-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";

export type CookieConsentChoice = "accepted" | "declined";

export function getCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

interface CookieConsentProps {
  message: string;
  acceptLabel: string;
  declineLabel: string;
}

export function CookieConsent({
  message,
  acceptLabel,
  declineLabel,
}: CookieConsentProps) {
  const [mounted, setMounted] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!getCookieConsent()) {
      setMounted(true);
    }

    const openForSettings = () => setMounted(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openForSettings);
    return () =>
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openForSettings);
  }, []);

  useEffect(() => {
    if (!mounted || !bannerRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, y: reduceMotion ? 0 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: reduceMotion ? 0 : 0.4,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert();
  }, [mounted]);

  const dismiss = (choice: CookieConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !bannerRef.current) {
      setMounted(false);
      return;
    }

    gsap.to(bannerRef.current, {
      opacity: 0,
      y: 24,
      duration: 0.3,
      ease: "power3.out",
      onComplete: () => setMounted(false),
    });
  };

  if (!mounted) return null;

  return (
    <div
      ref={bannerRef}
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie settings"
    >
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button size="small" variant="subtle" onPress={() => dismiss("declined")}>
          {declineLabel}
        </Button>
        <Button size="small" variant="primary" onPress={() => dismiss("accepted")}>
          {acceptLabel}
        </Button>
      </div>
    </div>
  );
}
