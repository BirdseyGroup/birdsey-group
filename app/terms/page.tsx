import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { LegalPageContent } from "../_components/LegalPageContent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Terms of Use | Birdsey Group",
  description:
    "The terms and conditions that govern your use of birdseygroup.com.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const contentPath = path.join(process.cwd(), "content/legal/terms.json");
  const contentFile = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(contentFile);

  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;
  const footerNavExtras = footerContent?.footerNavExtras || [];
  const footerLinks = footerContent?.footerLinks || [];

  return (
    <div className={`page-wrapper ${styles.legalPage}`}>
      <Header navItems={navigationContent?.items || []} />

      <main id="main-content" className={styles.mainContent}>
        <div className={styles.container}>
          <LegalPageContent
            title={content.title}
            lastUpdated={content.lastUpdated}
            body={content.body}
          />
        </div>
      </main>

      <Footer
        phone={footerContent?.phone || ""}
        email={footerContent?.email || ""}
        address={footerContent?.address || ""}
        copyright={footerContent?.copyright || ""}
        navItems={navigationContent?.items || []}
        footerNavExtras={footerNavExtras}
        footerLinks={footerLinks}
      />
    </div>
  );
}
