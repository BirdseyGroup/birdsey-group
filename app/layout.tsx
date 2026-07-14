import { promises as fs } from "fs";
import path from "path";
import { AllProviders } from "@/lib";
import { IS_INDEXABLE, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { CookieConsent } from "./_components/CookieConsent";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Birdsey Group, LLC | Real Estate Consulting",
    template: "%s | The Birdsey Group",
  },
  description:
    "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "The Birdsey Group, LLC | Real Estate Consulting",
    description:
      "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
    url: SITE_URL,
    siteName: "The Birdsey Group",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Birdsey Group - Real Estate Consulting",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Birdsey Group, LLC | Real Estate Consulting",
    description:
      "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
    images: ["/images/og-image.jpg"],
  },
  robots: { index: IS_INDEXABLE, follow: IS_INDEXABLE },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Birdsey Group, LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/images/birdsey-group-logo.svg`,
  description:
    "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
  sameAs: ["https://www.linkedin.com/company/birdsey-group"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalPath = path.join(process.cwd(), "content/global/settings.json");
  const globalFile = await fs.readFile(globalPath, "utf-8");
  const globalSettings = JSON.parse(globalFile);
  const cookieBanner = globalSettings.cookieBanner;

  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        <link
          rel="preload"
          href="/images/buildings.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <AllProviders>{children}</AllProviders>
        {cookieBanner && (
          <CookieConsent
            message={cookieBanner.message}
            acceptLabel={cookieBanner.acceptLabel}
            declineLabel={cookieBanner.declineLabel}
          />
        )}
      </body>
    </html>
  );
}
