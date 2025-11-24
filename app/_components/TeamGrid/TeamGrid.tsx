"use client";

import { useState } from "react";
import Image from "next/image";
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
}

interface TeamGridProps {
  members: TeamMember[];
  filterByAffiliate?: string;
}

export function TeamGrid({ members, filterByAffiliate }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing selected member to allow exit animation
    setTimeout(() => setSelectedMember(null), 300);
  };
  // Filter members by affiliate if specified (and not empty)
  const filteredMembers =
    filterByAffiliate && filterByAffiliate.trim()
      ? members.filter((member) => member.affiliate === filterByAffiliate)
      : members;

  // Sort members by order
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
      <div className={styles.teamGrid}>
        {sortedMembers.map((member) => (
          <button
            key={member.name}
            className={styles.teamMember}
            onClick={() => handleMemberClick(member)}
            type="button"
          >
            <div className={styles.photoWrapper}>
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className={styles.photo}
                />
              ) : null}
            </div>
            <div className={styles.memberInfo}>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberTitle}>{member.title}</p>
            </div>
          </button>
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
