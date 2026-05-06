"use client";

import { useId, useState } from "react";
import styles from "./aboutAccordion.module.css";

interface AccordionItem {
  title: string;
  content: string;
}

interface AboutAccordionProps {
  items: AccordionItem[];
}

export function AboutAccordion({ items }: AboutAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const headerId = `${baseId}-header-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div
            key={index}
            className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              id={headerId}
              className={styles.accordionTrigger}
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <div className={styles.accordionHeader}>
                <div className={styles.yellowAccent} aria-hidden="true" />
                <h3 className={styles.accordionTitle}>{item.title}</h3>
                <span className={styles.accordionIcon} aria-hidden="true">
                  <span className={styles.iconBar} />
                  <span className={`${styles.iconBar} ${styles.iconBarVertical}`} />
                </span>
              </div>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={styles.accordionContent}
            >
              <div className={styles.accordionContentInner}>
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
