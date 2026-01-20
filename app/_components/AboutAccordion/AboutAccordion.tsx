"use client";

import { useState } from "react";
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

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${
            openIndex === index ? styles.open : ""
          }`}
          onClick={() => toggleItem(index)}
          role="button"
          tabIndex={0}
          aria-expanded={openIndex === index}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleItem(index);
            }
          }}
        >
          <div className={styles.accordionHeader}>
            <div className={styles.yellowAccent} aria-hidden="true" />
            <h3 className={styles.accordionTitle}>{item.title}</h3>
            <span className={styles.accordionIcon}>
              {openIndex === index ? "−" : "+"}
            </span>
          </div>
          <div
            className={styles.accordionContent}
            style={{
              maxHeight: openIndex === index ? "1000px" : "0",
            }}
          >
            <div className={styles.accordionContentInner}>
              <p>{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
