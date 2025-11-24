"use client";

import styles from "./tabNavigation.module.css";

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className={styles.tabNavigation}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${
            activeTab === tab.id ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
