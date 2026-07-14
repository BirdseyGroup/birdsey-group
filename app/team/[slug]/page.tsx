import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "../../_components/Footer";
import { Header } from "../../_components/Header";
import { TeamProfileContent } from "./TeamProfileContent";
import styles from "./page.module.css";

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

interface TeamMemberData {
  name: string;
  title: string;
  photo?: string;
  bio?: any;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  affiliate?: string;
  profilePageEnabled?: boolean;
}

async function getMember(slug: string): Promise<TeamMemberData | null> {
  const filePath = path.join(process.cwd(), "content/team", `${slug}.json`);
  try {
    const file = await fs.readFile(filePath, "utf-8");
    const member = JSON.parse(file) as TeamMemberData;
    if (!member.profilePageEnabled) return null;
    return member;
  } catch {
    return null;
  }
}

async function getAffiliateName(
  affiliateRef: string | undefined,
): Promise<string | null> {
  if (!affiliateRef) return null;
  const match = affiliateRef.match(/\/([^\/]+)\.json$/);
  const slug = match ? match[1] : affiliateRef;
  try {
    const filePath = path.join(
      process.cwd(),
      "content/affiliates",
      `${slug}.json`,
    );
    const file = await fs.readFile(filePath, "utf-8");
    const affiliate = JSON.parse(file);
    return affiliate.name || affiliate.shortName || null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const teamDir = path.join(process.cwd(), "content/team");
  try {
    const files = await fs.readdir(teamDir);
    const params: { slug: string }[] = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      const member = await getMember(slug);
      if (member) params.push({ slug });
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMember(slug);
  if (!member) return {};

  const url = `https://www.birdseygroup.com/team/${slug}`;
  const description = `${member.title} at Birdsey Group.`;

  return {
    title: `${member.name} | Birdsey Group`,
    description,
    alternates: { canonical: `/team/${slug}` },
    openGraph: {
      title: member.name,
      description,
      url,
      type: "profile",
      ...(member.photo && {
        images: [
          {
            url: `https://www.birdseygroup.com${member.photo}`,
            alt: member.name,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: member.name,
      description,
      ...(member.photo && {
        images: [`https://www.birdseygroup.com${member.photo}`],
      }),
    },
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;

  const member = await getMember(slug);
  if (!member) notFound();

  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);
  const footerContent = globalSettings.footer;
  const navigationContent = globalSettings.navigation;
  const footerNavExtras = footerContent?.footerNavExtras || [];
  const footerLinks = footerContent?.footerLinks || [];

  const affiliateName = await getAffiliateName(member.affiliate);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.title,
    url: `https://www.birdseygroup.com/team/${slug}`,
    worksFor: {
      "@type": "Organization",
      name: "The Birdsey Group, LLC",
      url: "https://www.birdseygroup.com",
    },
    ...(member.photo && {
      image: `https://www.birdseygroup.com${member.photo}`,
    }),
    ...(member.linkedinUrl && { sameAs: [member.linkedinUrl] }),
  };

  return (
    <div className={`page-wrapper ${styles.profilePage}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Header navItems={navigationContent?.items || []} />

      <main id="main-content" className={styles.mainContent}>
        <div className={styles.container}>
          <TeamProfileContent
            member={member}
            affiliateName={affiliateName}
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
