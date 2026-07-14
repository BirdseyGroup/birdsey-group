"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AboutAccordion } from "../AboutAccordion";
import { TabNavigation } from "../TabNavigation";
import { TeamGrid } from "../TeamGrid";
import styles from "./teamSection.module.css";

interface AccordionItem {
  title: string;
  content: string;
  titleTinaField?: string;
  contentTinaField?: string;
}

interface Affiliate {
  name: string;
  shortName: string;
  slug: string;
}

interface TeamMember {
  name: string;
  title: string;
  photo?: string;
  order: number;
  affiliate: string;
  tinaField?: string;
}

interface TeamSectionProps {
  accordionItems: AccordionItem[];
  affiliates: Affiliate[];
  teamMembers: TeamMember[];
}

export function TeamSection({
  accordionItems,
  affiliates,
  teamMembers,
}: TeamSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter affiliates to only show those with team members
  const affiliatesWithMembers = affiliates.filter((affiliate) =>
    teamMembers.some((member) => member.affiliate === affiliate.slug)
  );

  // Get initial tab from URL or default to first affiliate
  const tabFromUrl = searchParams.get("team");
  const defaultTab = affiliatesWithMembers[0]?.slug || "";
  const initialTab =
    tabFromUrl &&
    affiliatesWithMembers.some((a) => a.slug === tabFromUrl)
      ? tabFromUrl
      : defaultTab;

  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("team", tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Sync state with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const tabFromUrl = searchParams.get("team");
    if (
      tabFromUrl &&
      affiliatesWithMembers.some((a) => a.slug === tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, affiliatesWithMembers]);

  const tabs = affiliatesWithMembers.map((affiliate) => ({
    id: affiliate.slug,
    label: affiliate.shortName.toUpperCase(),
  }));

  return (
    <div className={styles.teamSection}>
      <div className={styles.container}>
        <div className={styles.contentLayout}>
          <div className={styles.leftColumn}>
            <AboutAccordion items={accordionItems} />
          </div>

          <div className={styles.rightColumn}>
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <TeamGrid members={teamMembers} filterByAffiliate={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
