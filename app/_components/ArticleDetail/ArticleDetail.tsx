"use client";

import Link from "next/link";
import styles from "./articleDetail.module.css";

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
  body,
}: ArticleDetailProps) {
  return (
    <article className={styles.article}>
      <Link href="/#news" className={styles.backLink}>
        &larr; Back to Insights
      </Link>

      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.category}>{category}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
      </header>

      <div className={styles.body}>
        <p className={styles.excerpt}>{excerpt}</p>
        {body.children?.map((node, i) => renderNode(node, i))}
      </div>
    </article>
  );
}
