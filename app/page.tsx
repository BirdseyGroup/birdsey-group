import {
  Header,
  Footer,
  HeroSection,
  SubHeroSection,
  AffiliatesSection,
  FamilyBrandsSection,
  PerformanceSection,
  NewsSection,
  CareersSection,
  ContactSection,
} from '@/components/compositions';

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
