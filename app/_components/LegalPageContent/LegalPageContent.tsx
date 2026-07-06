import { TinaMarkdown, type TinaMarkdownContent } from "tinacms/dist/rich-text";
import styles from "./legalPageContent.module.css";

interface LegalPageContentProps {
  title: string;
  lastUpdated: string;
  body: TinaMarkdownContent;
}

export function LegalPageContent({
  title,
  lastUpdated,
  body,
}: LegalPageContentProps) {
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{title}</h1>
      {lastUpdated && (
        <p className={styles.updated}>Last updated: {lastUpdated}</p>
      )}
      <div className={styles.richText}>
        <TinaMarkdown content={body} />
      </div>
    </article>
  );
}
