import { promises as fs } from "fs";
import path from "path";
import { AffiliatesSection } from "./_components/AffiliatesSection";
import { BrandCarousel } from "./_components/BrandCarousel";
import { CareersSection } from "./_components/CareersSection";
import { ContactSection } from "./_components/ContactSection";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { HeroSection } from "./_components/HeroSection";
import { NewsSection } from "./_components/NewsSection";
import { PerformanceSection } from "./_components/PerformanceSection";
import { SubHeroSection } from "./_components/SubHeroSection";
import styles from "./page.module.css";

export default async function HomePage() {
  // Read page content
  const contentPath = path.join(process.cwd(), "content/pages/home.json");
  const contentFile = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(contentFile);

  // Read global settings
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  const heroContent = content.hero;
  const subHeroContent = content.subHero;
  const affiliatesContent = content.affiliates;
  const performanceContent = content.performance;
  const newsContent = content.news;
  const careersContent = content.careers;
  const contactContent = content.contact;
  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;

  return (
    <div className={styles.birdseyPage}>
      <Header navItems={navigationContent?.items || []} />
      <HeroSection
        title={heroContent?.title || ""}
        subtitle={heroContent?.subtitle || ""}
        primaryButton={heroContent?.primaryButton}
        secondaryButton={heroContent?.secondaryButton}
      />
      <SubHeroSection
        title={subHeroContent?.title || ""}
        description={subHeroContent?.description || ""}
      />
      <AffiliatesSection
        sectionTitle={affiliatesContent?.sectionTitle || ""}
        items={affiliatesContent?.items || []}
      />
      <BrandCarousel items={affiliatesContent?.items || []} />
      <PerformanceSection
        title={performanceContent?.title || ""}
        stats={performanceContent?.stats || []}
      />
      <NewsSection
        title={newsContent?.title || ""}
        articles={newsContent?.articles || []}
      />
      <CareersSection
        title={careersContent?.title || ""}
        content={careersContent?.content || ""}
        email={careersContent?.email || ""}
      />
      <ContactSection
        title={contactContent?.title || ""}
        formTitle={contactContent?.formTitle || ""}
        formDescription={contactContent?.formDescription || ""}
        submitButtonText={contactContent?.submitButtonText || ""}
      />
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
