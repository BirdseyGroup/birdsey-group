import { Header } from './_components/Header';
import { Footer } from './_components/Footer';
import { HeroSection } from './_components/HeroSection';
import { SubHeroSection } from './_components/SubHeroSection';
import { AffiliatesSection } from './_components/AffiliatesSection';
import { FamilyBrandsSection } from './_components/FamilyBrandsSection';
import { PerformanceSection } from './_components/PerformanceSection';
import { NewsSection } from './_components/NewsSection';
import { CareersSection } from './_components/CareersSection';
import { ContactSection } from './_components/ContactSection';

export default function HomePage() {
  return (
    <div className="birdsey-page">
      <Header />
      <HeroSection />
      <SubHeroSection />
      <AffiliatesSection />
      <FamilyBrandsSection />
      <PerformanceSection />
      <NewsSection />
      <CareersSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
