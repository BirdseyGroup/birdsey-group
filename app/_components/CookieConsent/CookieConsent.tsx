"use client";

import { useEffect, useState } from "react";
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      setVisible(true);
    }

    const openForSettings = () => setVisible(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openForSettings);
    return () =>
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openForSettings);
  }, []);

  const choose = (choice: CookieConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie settings">
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button size="small" variant="subtle" onPress={() => choose("declined")}>
          {declineLabel}
        </Button>
        <Button size="small" variant="primary" onPress={() => choose("accepted")}>
          {acceptLabel}
        </Button>
      </div>
    </div>
  );
}
