import type { ReactNode } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";

/**
 * Renders the bio for a team member. Tina rich-text fields normally store
 * an AST that <TinaMarkdown> handles natively. Tina sometimes falls back
 * to writing the value as a plain markdown string (e.g. after a field was
 * cleared to ""); we parse that case ourselves.
 */
export function renderTeamBio(content: any): ReactNode {
  if (!content) return null;

  if (typeof content === "string") {
    if (!content.trim() || content === "[object Object]") return null;
    return renderMarkdownBlocks(content);
  }

  if (!content.children || !Array.isArray(content.children)) return null;

  const hasContent = content.children.some(
    (child: any) => extractPlainText(child).trim().length > 0,
  );
  if (!hasContent) return null;

  return <TinaMarkdown content={content} />;
}

/* ───────── Markdown-string fallback ───────── */

function renderMarkdownBlocks(text: string): ReactNode {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block.split("\n").map((l) => l.trim());

    const headingMatch = block.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch && lines.length === 1) {
      const level = headingMatch[1].length;
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      return <Tag key={i}>{renderMarkdownInline(headingMatch[2])}</Tag>;
    }

    const isList = lines.every((l) => /^[*-]\s+/.test(l));
    if (isList) {
      return (
        <ul key={i}>
          {lines.map((l, idx) => (
            <li key={idx}>
              {renderMarkdownInline(l.replace(/^[*-]\s+/, ""))}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i}>
        {lines.map((line, idx) => (
          <span key={idx}>
            {idx > 0 && <br />}
            {renderMarkdownInline(line)}
          </span>
        ))}
      </p>
    );
  });
}

function renderMarkdownInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<strong key={`b-${key++}`}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function extractPlainText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (!node.children || !Array.isArray(node.children)) return "";
  return node.children.map(extractPlainText).join("");
}
