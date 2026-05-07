"use client";

import { useState } from "react";
import Image from "next/image";
import { LinkedInGlyph } from "../LinkedInGlyph";
import { TeamMemberModal } from "../TeamMemberModal";
import styles from "./teamGrid.module.css";

interface TeamMember {
  name: string;
  title: string;
  photo?: string;
  order: number;
  affiliate: string;
  bio?: any;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  miniBioEnabled?: boolean;
  slug?: string;
  profilePageEnabled?: boolean;
}

interface TeamGridProps {
  members: TeamMember[];
  filterByAffiliate?: string;
}

interface TeamCardProps {
  member: TeamMember;
  onOpenBio: (member: TeamMember) => void;
  priority?: boolean;
}

function TeamCard({ member, onOpenBio, priority = false }: TeamCardProps) {
  return (
    <div className={styles.teamMember}>
      <div
        className={`${styles.photoWrapper} ${
          !member.photo ? styles.photoWrapperPlaceholder : ""
        }`}
      >
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={priority}
            className={styles.photo}
          />
        ) : (
          <img
            src="/images/birdsey-icon-only-blue.svg"
            alt=""
            aria-hidden="true"
            className={styles.placeholderLogo}
          />
        )}
      </div>
      <div className={styles.memberInfo}>
        <div className={styles.memberHeader}>
          <h3 className={styles.memberName}>{member.name}</h3>
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkedinButton}
              aria-label={`${member.name} on LinkedIn`}
            >
              <LinkedInGlyph size={18} />
            </a>
          )}
        </div>
        <p className={styles.memberTitle}>{member.title}</p>
      </div>
      {(() => {
        const profileHref =
          member.profilePageEnabled && member.slug
            ? `/team/${member.slug}`
            : member.linkedinUrl;
        const isInternalProfile = Boolean(
          member.profilePageEnabled && member.slug
        );

        if (!profileHref && !member.miniBioEnabled) return null;

        return (
          <div className={styles.memberActions}>
            {member.miniBioEnabled && (
              <button
                type="button"
                className={styles.miniBioLink}
                onClick={() => onOpenBio(member)}
              >
                Mini bio
              </button>
            )}
            {profileHref && (
              <a
                href={profileHref}
                {...(isInternalProfile
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className={styles.viewProfileLink}
              >
                View Profile
                <span aria-hidden="true" className={styles.viewProfileArrow}>
                  →
                </span>
              </a>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export function TeamGrid({ members, filterByAffiliate }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenBio = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  const filteredMembers =
    filterByAffiliate && filterByAffiliate.trim()
      ? members.filter((member) => member.affiliate === filterByAffiliate)
      : members;

  const sortedMembers = [...filteredMembers].sort((a, b) => a.order - b.order);

  if (sortedMembers.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No team members found for this category.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.teamGrid} key={filterByAffiliate || "all"}>
        {sortedMembers.map((member, idx) => (
          <TeamCard
            key={`${member.affiliate}-${member.name}`}
            member={member}
            onOpenBio={handleOpenBio}
            priority={idx < 4}
          />
        ))}
      </div>

      {selectedMember && (
        <TeamMemberModal
          member={{
            name: selectedMember.name,
            title: selectedMember.title,
            photo: selectedMember.photo,
            email: selectedMember.email,
            phone: selectedMember.phone,
            linkedIn: selectedMember.linkedinUrl,
            bio: selectedMember.bio,
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
