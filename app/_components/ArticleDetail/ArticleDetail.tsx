"use client";

import { usePathname } from "next/navigation";
import styles from "./articleDetail.module.css";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

interface RichTextNode {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  children?: RichTextNode[];
}

interface ArticleDetailProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string;
  body: RichTextNode;
}

function renderNode(node: RichTextNode, index: number): React.ReactNode {
  if (node.type === "text") {
    let content: React.ReactNode = node.text || "";
    if (node.bold) {
      content = <strong key={index}>{content}</strong>;
    }
    if (node.italic) {
      content = <em key={index}>{content}</em>;
    }
    return content;
  }

  const children = node.children?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case "p":
      return (
        <p key={index} className={styles.paragraph}>
          {children}
        </p>
      );
    case "h2":
      return (
        <h2 key={index} className={styles.heading2}>
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 key={index} className={styles.heading3}>
          {children}
        </h3>
      );
    case "ul":
      return (
        <ul key={index} className={styles.list}>
          {children}
        </ul>
      );
    case "ol":
      return (
        <ol key={index} className={styles.list}>
          {children}
        </ol>
      );
    case "li":
      return <li key={index}>{children}</li>;
    case "lic":
      return <>{children}</>;
    case "blockquote":
      return (
        <blockquote key={index} className={styles.blockquote}>
          {children}
        </blockquote>
      );
    default:
      return <>{children}</>;
  }
}

export function ArticleDetail({
  title,
  date,
  category,
  excerpt,
  image,
  body,
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
            <span className={styles.category}>{category}</span>
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
        <h1 className={styles.title}>{title}</h1>
      </header>

      {image && (
        <img
          src={image}
          alt={title}
          className={styles.featuredImage}
        />
      )}

      <div className={styles.body}>
        <p className={styles.excerpt}>{excerpt}</p>
        {body.children?.map((node, i) => renderNode(node, i))}
      </div>
    </article>
  );
}
