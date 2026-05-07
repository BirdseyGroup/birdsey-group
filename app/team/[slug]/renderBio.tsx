import type { ReactNode } from "react";

/**
 * Minimal renderer for the TinaCMS rich-text shape stored in
 * content/team/*.json. Mirrors the helper inside TeamMemberModal so this
 * route can stay a server component.
 */
export function renderTeamBio(content: any): ReactNode {
  if (!content) return null;

  if (typeof content === "string") {
    if (!content.trim() || content === "[object Object]") return null;
    return content
      .split(/\n\n+/)
      .map((para, i) => <p key={i}>{para.trim() || " "}</p>);
  }

  if (!content.children || !Array.isArray(content.children)) return null;

  // If every paragraph is empty, treat as no bio.
  const hasContent = content.children.some(
    (child: any) => extractPlainText(child).trim().length > 0,
  );
  if (!hasContent) return null;

  return content.children.map((child: any, index: number) => {
    if (!child) return null;

    if (
      child.type === "h1" ||
      child.type === "h2" ||
      child.type === "h3"
    ) {
      const Tag = child.type as keyof JSX.IntrinsicElements;
      return <Tag key={index}>{renderInline(child)}</Tag>;
    }

    if (child.type === "ul" || child.type === "ol") {
      const ListTag = child.type as keyof JSX.IntrinsicElements;
      return (
        <ListTag key={index}>
          {(child.children || []).map((li: any, liIndex: number) => (
            <li key={liIndex}>{renderInline(li)}</li>
          ))}
        </ListTag>
      );
    }

    // Default: paragraph (covers explicit p and untyped text-bearing nodes)
    if (extractPlainText(child).trim() === "") {
      return <p key={index}>&nbsp;</p>;
    }
    return <p key={index}>{renderInline(child)}</p>;
  });
}

function renderInline(node: any): ReactNode[] {
  if (!node) return [];

  if (typeof node.text === "string") {
    return [applyMarks(node)];
  }

  if (!node.children || !Array.isArray(node.children)) return [];

  const out: ReactNode[] = [];
  node.children.forEach((child: any, index: number) => {
    if (typeof child.text === "string") {
      if (child.text === "" && index > 0) {
        out.push(<br key={`br-${index}`} aria-hidden="true" />);
      } else if (child.text) {
        out.push(applyMarks(child, index));
      }
    } else {
      out.push(...renderInline(child));
    }
  });
  return out;
}

function applyMarks(node: any, key?: number): ReactNode {
  let element: ReactNode = node.text;
  if (node.bold) element = <strong key={`b-${key}`}>{element}</strong>;
  if (node.italic) element = <em key={`i-${key}`}>{element}</em>;
  if (node.underline) element = <u key={`u-${key}`}>{element}</u>;
  return element;
}

function extractPlainText(node: any): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  if (!node.children || !Array.isArray(node.children)) return "";
  return node.children.map(extractPlainText).join("");
}
