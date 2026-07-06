import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { HeroSection } from "../_components/HeroSection";

export const metadata: Metadata = {
  title: "Thank You | Birdsey Group",
  description: "Your message has been sent to the Birdsey Group team.",
  robots: { index: false },
};

export default async function ThankYouPage() {
  // Read global settings
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);

  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;
  const footerNavExtras = footerContent?.footerNavExtras || [];
  const footerLinks = footerContent?.footerLinks || [];

  return (
    <div className="page-wrapper">
      <Header navItems={navigationContent?.items || []} />

      <main id="main-content">
        <HeroSection
          title="Thank you."
          subtitle="Your message has been sent. A member of the Birdsey team will be in touch shortly."
          backgroundImage="/images/construction-team.webp"
          primaryButton={{ text: "Back to Home", href: "/" }}
          variant="simple"
        />
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
