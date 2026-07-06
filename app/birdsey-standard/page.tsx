import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { ContactSection } from "../_components/ContactSection";
import { Footer } from "../_components/Footer";
import { Header } from "../_components/Header";
import { HeroSection } from "../_components/HeroSection";
import { ScrollReveal } from "../_components/ScrollReveal";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Birdsey Standard | Birdsey Group",
  description:
    "The Birdsey Standard defines how we earn client confidence through five core principles: Quality, Urgency, Accountability, Resilience, and Transparency.",
  alternates: { canonical: "/birdsey-standard" },
};

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text.split("\n\n").map((p, i) => (
        <p key={i} className={className}>
          {p}
        </p>
      ))}
    </>
  );
}

export default async function BirdseyStandardPage() {
  const contentPath = path.join(process.cwd(), "content/pages/birdsey-standard.json");
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
    <div className={`page-wrapper ${styles.birdseyStandardPage}`}>
      <Header navItems={navigationContent?.items || []} />

      {content.hero && (
        <HeroSection
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          variant="simple"
        />
      )}

      <main id="main-content" className={styles.mainContent}>
        {/* Intro */}
        {content.intro && (
          <section className={styles.introSection}>
            <ScrollReveal className={styles.prose}>
              <Paragraphs text={content.intro} className={styles.bodyText} />
            </ScrollReveal>
          </section>
        )}

        {/* Body sections: heading → divider → body */}
        {content.sections?.map(
          (section: { heading: string; body: string }, i: number) => (
            <section key={i} className={styles.bodySection}>
              <ScrollReveal className={styles.prose}>
                <h2 className={styles.sectionHeading}>{section.heading}</h2>

                <Paragraphs text={section.body} className={styles.bodyText} />
              </ScrollReveal>
            </section>
          )
        )}

        {/* Principles */}
        {content.principles?.length > 0 && (
          <section className={styles.principlesSection}>
            <div className={styles.prose}>
              <ScrollReveal className={styles.principlesHeader}>
                <h2 className={styles.principlesTitle}>{content.principlesTitle}</h2>

                {content.principlesIntro && (
                  <p className={styles.principlesIntro}>{content.principlesIntro}</p>
                )}
              </ScrollReveal>
              <div className={styles.principlesGrid}>
                {content.principles.map((p: { name: string; body: string }, i: number) => (
                  <ScrollReveal
                    key={i}
                    className={styles.principleCard}
                    delay={Math.min(i * 0.08, 0.32)}
                  >
                    <h3 className={styles.principleCardName}>{p.name}</h3>
                    <p className={styles.principleCardBody}>{p.body}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Commitments: heading → divider → body */}
        {content.commitments?.map(
          (c: { heading: string; body: string }, i: number) => (
            <section key={i} className={styles.bodySection}>
              <ScrollReveal className={styles.prose}>
                <h2 className={styles.sectionHeading}>{c.heading}</h2>

                <Paragraphs text={c.body} className={styles.bodyText} />
              </ScrollReveal>
            </section>
          )
        )}

        {/* Info blocks */}
        {content.infoBlocks?.length > 0 && (
          <section className={styles.infoBlocksSection}>
            <div className={styles.prose}>
              {content.infoBlocks.map(
                (b: { heading: string; body: string }, i: number) => (
                  <ScrollReveal
                    key={i}
                    className={styles.infoBlock}
                    delay={Math.min(i * 0.08, 0.32)}
                  >
                    <h3 className={styles.infoBlockHeading}>{b.heading}</h3>

                    <Paragraphs text={b.body} className={styles.bodyText} />
                  </ScrollReveal>
                )
              )}
            </div>
          </section>
        )}

        {/* Closing: heading → divider → body */}
        {content.closing && (
          <section className={styles.closingSection}>
            <ScrollReveal className={styles.prose}>
              <h2 className={styles.sectionHeading}>{content.closing.heading}</h2>
              <Paragraphs text={content.closing.body} className={styles.bodyText} />
            </ScrollReveal>
          </section>
        )}
      </main>

      {content.contact && (
        <ContactSection
          title={content.contact.title}
          formTitle={content.contact.formTitle}
          formDescription={content.contact.formDescription}
          submitButtonText={content.contact.submitButtonText}
        />
      )}

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
