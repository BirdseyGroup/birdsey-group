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
  // Read content directly from the file system
  const contentPath = path.join(process.cwd(), "content/pages/home.json");
  const contentFile = await fs.readFile(contentPath, "utf-8");
  const content = JSON.parse(contentFile);
  const heroContent = content.hero;

  return (
    <div className={styles.birdseyPage}>
      <Header />
      <HeroSection
        title={heroContent?.title || ""}
        subtitle={heroContent?.subtitle || ""}
        primaryButton={heroContent?.primaryButton}
        secondaryButton={heroContent?.secondaryButton}
      />
      <SubHeroSection />
      <AffiliatesSection />
      <BrandCarousel />
      <PerformanceSection /> d
      <NewsSection />
      <CareersSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
