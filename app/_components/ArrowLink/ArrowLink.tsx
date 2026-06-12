import { clsx } from "clsx";
import { ComponentPropsWithoutRef } from "react";
import styles from "./arrowLink.module.css";

export type ArrowLinkProps = ComponentPropsWithoutRef<"a">;

/**
 * Inline "label →" link with the shared hover motion: the underline grows
 * from the left while the arrow nudges right. Pass `className` for contextual
 * sizing/spacing. To trigger the motion from a hovered ancestor (e.g. a whole
 * card) instead of the link itself, add the global `arrowLinkHoverScope`
 * class to that ancestor.
 */
export function ArrowLink({ className, children, ...props }: ArrowLinkProps) {
  return (
    <a className={clsx(styles.arrowLink, className)} {...props}>
      <span className={styles.label}>{children}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={styles.arrow}
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
