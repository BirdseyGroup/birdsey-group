"use client";

import { useState } from "react";
import Image from "next/image";
import { TeamMemberModal } from "../TeamMemberModal";
import styles from "./teamGrid.module.css";

function LinkedInGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

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
      {(member.miniBioEnabled || member.linkedinUrl) && (
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
          {member.linkedinUrl && (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewProfileLink}
            >
              View Profile
              <span aria-hidden="true" className={styles.viewProfileArrow}>
                →
              </span>
            </a>
          )}
        </div>
      )}
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
