"use client";

import { usePathname } from "next/navigation";
import {
  TinaMarkdown,
  type Components,
  type TinaMarkdownContent,
} from "tinacms/dist/rich-text";
import styles from "./articleDetail.module.css";

function formatDate(dateStr: string) {
  // A bare "YYYY-MM-DD" needs a time appended so it parses in the local
  // timezone rather than UTC (which can shift the displayed date by a day).
  // A `datetime` field's live-edit value already includes a "T", so only
  // append when it's missing.
  const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

interface ArticleDetailProps {
  title: string;
  titleTinaField?: string;
  date: string;
  category: string;
  categoryTinaField?: string;
  excerpt: string;
  excerptTinaField?: string;
  image?: string;
  imageTinaField?: string;
  body: TinaMarkdownContent;
  bodyTinaField?: string;
}

// <TinaMarkdown> rather than a hand-rolled walker: the editor's leaf nodes
// carry no `type` key at all (just `{ text, bold, italic }`), and older
// articles store them as `{ type: "text", ... }`. TinaMarkdown handles both
// shapes, plus every block type the rich-text field can produce (h1-h6,
// links, images, code) rather than only the handful we anticipated.
// Only `children` is forwarded: the AST nodes also carry `type` and `id`
// keys, which are invalid DOM attributes if spread onto the element.
const bodyComponents: Components<Record<never, never>> = {
  p: (props) => <p className={styles.paragraph}>{props?.children}</p>,
  h1: (props) => <h1 className={styles.heading1}>{props?.children}</h1>,
  h2: (props) => <h2 className={styles.heading2}>{props?.children}</h2>,
  h3: (props) => <h3 className={styles.heading3}>{props?.children}</h3>,
  h4: (props) => <h4 className={styles.heading4}>{props?.children}</h4>,
  h5: (props) => <h5 className={styles.heading5}>{props?.children}</h5>,
  h6: (props) => <h6 className={styles.heading6}>{props?.children}</h6>,
  ul: (props) => <ul className={styles.list}>{props?.children}</ul>,
  ol: (props) => <ol className={styles.list}>{props?.children}</ol>,
  li: (props) => <li>{props?.children}</li>,
  // Default renders list-item content in a <div>, which breaks the marker
  // alignment; keep it inline.
  lic: (props) => <>{props?.children}</>,
  blockquote: (props) => (
    <blockquote className={styles.blockquote}>{props?.children}</blockquote>
  ),
  a: (props) => (
    <a
      className={styles.link}
      href={props?.url}
      {...(props?.url?.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {props?.children}
    </a>
  ),
  img: (props) => (
    <img className={styles.bodyImage} src={props?.url} alt={props?.alt ?? ""} />
  ),
};

export function ArticleDetail({
  title,
  titleTinaField,
  date,
  category,
  categoryTinaField,
  excerpt,
  excerptTinaField,
  image,
  imageTinaField,
  body,
  bodyTinaField,
}: ArticleDetailProps) {
  const pathname = usePathname();

  const handleLinkedInShare = () => {
    const url = `https://www.birdseygroup.com${pathname}`;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.meta}>
            <span className={styles.category} data-tina-field={categoryTinaField}>
              {category}
            </span>
            {date && <span className={styles.date}>{formatDate(date)}</span>}
          </div>
          <button
            onClick={handleLinkedInShare}
            className={styles.shareButton}
            aria-label="Share on LinkedIn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share
          </button>
        </div>
        <h1 className={styles.title} data-tina-field={titleTinaField}>
          {title}
        </h1>
      </header>

      {image && (
        <img
          src={image}
          alt={title}
          className={styles.featuredImage}
          data-tina-field={imageTinaField}
        />
      )}

      <div className={styles.body}>
        <p className={styles.excerpt} data-tina-field={excerptTinaField}>
          {excerpt}
        </p>
        <div data-tina-field={bodyTinaField}>
          <TinaMarkdown content={body} components={bodyComponents} />
        </div>
      </div>
    </article>
  );
}
