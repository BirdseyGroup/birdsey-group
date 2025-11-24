import { promises as fs } from "fs";
import path from "path";
import { Suspense } from "react";
import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { HeroSection } from "../_components/HeroSection";
import { TeamSection } from "../_components/TeamSection";
import styles from "./page.module.css";

export default async function AboutPage() {
  // Read about page content
  const aboutPath = path.join(process.cwd(), "content/pages/about.json");
  const aboutFile = await fs.readFile(aboutPath, "utf-8");
  const aboutContent = JSON.parse(aboutFile);

  // Read global settings
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  // Read affiliates
  const affiliatesDir = path.join(process.cwd(), "content/affiliates");
  const affiliateFiles = await fs.readdir(affiliatesDir);
  const affiliates = (
    await Promise.all(
      affiliateFiles
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const filePath = path.join(affiliatesDir, file);
          const fileContent = await fs.readFile(filePath, "utf-8");
          return JSON.parse(fileContent);
        })
    )
  ).sort((a, b) => (a.order || 999) - (b.order || 999));

  // Read team members
  const teamDir = path.join(process.cwd(), "content/team");
  const teamFiles = await fs.readdir(teamDir);
  const teamMembers = await Promise.all(
    teamFiles
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const filePath = path.join(teamDir, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const member = JSON.parse(fileContent);

        // Extract slug from affiliate reference path
        // e.g., "content/affiliates/birdsey-group.json" -> "birdsey-group"
        if (member.affiliate && typeof member.affiliate === "string") {
          const match = member.affiliate.match(/\/([^\/]+)\.json$/);
          if (match) {
            member.affiliate = match[1];
          }
        }

        return member;
      })
  );

  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;

  return (
    <div className={styles.aboutPage}>
      <Header navItems={navigationContent?.items || []} />

      {aboutContent.hero && (
        <HeroSection
          title={aboutContent.hero.title}
          subtitle={aboutContent.hero.subtitle}
          backgroundImage={aboutContent.hero.backgroundImage}
          variant="simple"
        />
      )}

      <main className={styles.mainContent}>
        <div className={styles.container}>
          <Suspense fallback={<div>Loading...</div>}>
            <TeamSection
              accordionItems={aboutContent.accordionItems || []}
              affiliates={affiliates}
              teamMembers={teamMembers}
            />
          </Suspense>
        </div>
      </main>

      <Footer
        phone={footerContent?.phone || ""}
        email={footerContent?.email || ""}
        address={footerContent?.address || ""}
        copyright={footerContent?.copyright || ""}
        navItems={navigationContent?.items || []}
      />
    </div>
  );
}
