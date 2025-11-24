"use client";

import { useEffect } from "react";
import Image from "next/image";
import { IconX, IconPhone, IconMail, IconLinkedin } from "icons";
import styles from "./teamMemberModal.module.css";

interface TeamMember {
  name: string;
  title: string;
  photo?: string;
  email?: string;
  phone?: string;
  linkedIn?: string;
  bio?: string | any;
}

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to render rich-text content
function renderRichText(content: any): React.ReactNode {
  if (!content) return null;

  console.log("renderRichText content:", JSON.stringify(content, null, 2));

  // If it's a string, handle it
  if (typeof content === "string") {
    if (content === "[object Object]" || content === "\\[object Object]") {
      return null;
    }
    // Split by double newlines to create paragraphs
    return content.split(/\n\n+/).map((para, i) => (
      <p key={i}>{para.trim() || "\u00A0"}</p>
    ));
  }

  // Handle TinaCMS rich-text structure (root children)
  if (content.children && Array.isArray(content.children)) {
    console.log("Processing children:", content.children.length);

    return content.children.map((child: any, index: number) => {
      if (!child) return null;

      console.log(`Child ${index}:`, child);

      // Each child should be a paragraph or block-level element
      if (child.type === "p") {
        const plainText = extractPlainText(child);
        // Render blank paragraphs
        if (!plainText || plainText.trim() === "") {
          return <p key={index}>&nbsp;</p>;
        }
        const content = extractTextFromNode(child);
        return <p key={index}>{content}</p>;
      }

      // Handle heading nodes
      if (child.type === "h1" || child.type === "h2" || child.type === "h3") {
        const content = extractTextFromNode(child);
        const Tag = child.type as keyof JSX.IntrinsicElements;
        return <Tag key={index}>{content}</Tag>;
      }

      // If it has children but no type, it might be a paragraph
      if (child.children && Array.isArray(child.children)) {
        const plainText = extractPlainText(child);
        if (!plainText || plainText.trim() === "") {
          return <p key={index}>&nbsp;</p>;
        }
        const content = extractTextFromNode(child);
        return <p key={index}>{content}</p>;
      }

      // Handle direct text nodes (shouldn't happen at root level)
      if (child.text !== undefined) {
        return <p key={index}>{child.text}</p>;
      }

      return null;
    });
  }

  return null;
}

// Helper to extract text and elements from a node (including line breaks)
function extractTextFromNode(node: any): React.ReactNode[] {
  if (!node) return [];

  if (typeof node.text === "string") {
    return [node.text];
  }

  if (node.children && Array.isArray(node.children)) {
    const result: React.ReactNode[] = [];
    node.children.forEach((child: any, index: number) => {
      if (child.text !== undefined) {
        // Check if this is a line break (empty text after a text node)
        if (child.text === "" && index > 0) {
          result.push(<br key={`br-${index}`} aria-hidden="true" />);
        } else if (child.text) {
          result.push(child.text);
        }
      } else {
        result.push(...extractTextFromNode(child));
      }
    });
    return result;
  }

  return [];
}

// Helper to extract plain text (for checking if empty)
function extractPlainText(node: any): string {
  if (!node) return "";

  if (typeof node.text === "string") {
    return node.text;
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractPlainText(child))
      .join("");
  }

  return "";
}

export function TeamMemberModal({
  member,
  isOpen,
  onClose,
}: TeamMemberModalProps) {
  // Debug logging
  useEffect(() => {
    if (member && isOpen) {
      console.log("TeamMemberModal member data:", member);
    }
  }, [member, isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!member) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`${styles.modal} ${isOpen ? styles.modalVisible : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className={styles.modalContent}>
          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <IconX size={24} />
          </button>

          {/* Profile photo */}
          {member.photo && (
            <div className={styles.photoContainer}>
              <Image
                src={member.photo}
                alt={member.name}
                width={400}
                height={320}
                className={styles.photo}
              />
            </div>
          )}

          {/* Content */}
          <div className={styles.content}>
            {/* Header row: Yellow line + Name on left, Contact buttons on right */}
            <div className={styles.headerRow}>
              <div className={styles.headerLeft}>
                <div className={styles.yellowAccent} aria-hidden="true" />
                <h2 id="modal-title" className={styles.name}>
                  {member.name}
                </h2>
              </div>

              {/* Contact actions */}
              {(member.phone || member.email || member.linkedIn) && (
                <div className={styles.contactActions}>
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className={styles.contactButton}
                      aria-label="Call"
                    >
                      <IconPhone size={20} />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className={styles.contactButton}
                      aria-label="Email"
                    >
                      <IconMail size={20} />
                    </a>
                  )}
                  {member.linkedIn && (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactButton}
                      aria-label="LinkedIn"
                    >
                      <IconLinkedin size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description section */}
            <div className={styles.description}>
              {/* Job title */}
              {member.title && <p className={styles.title}>{member.title}</p>}

              {/* Biography */}
              {member.bio && (() => {
                const renderedBio = renderRichText(member.bio);
                if (renderedBio) {
                  return <div className={styles.bio}>{renderedBio}</div>;
                }
                return (
                  <p className={styles.noBio}>
                    Biography not yet added. Please update via CMS.
                  </p>
                );
              })()}

              {/* Show message if no bio at all */}
              {!member.bio && (
                <p className={styles.noBio}>
                  Biography not yet added. Please update via CMS.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
