import { AllProviders } from "@/lib";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "The Birdsey Group, LLC | Real Estate Consulting",
  description: "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
  icons: {
    icon: [
      { url: "/images/favicons/favicon16.jpg", sizes: "16x16", type: "image/jpeg" },
      { url: "/images/favicons/favicon32.jpg", sizes: "32x32", type: "image/jpeg" },
      { url: "/images/favicons/favicon48.jpg", sizes: "48x48", type: "image/jpeg" },
    ],
  },
  openGraph: {
    title: "The Birdsey Group, LLC | Real Estate Consulting",
    description: "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Birdsey Group - Real Estate Consulting",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Birdsey Group, LLC | Real Estate Consulting",
    description: "The Standard of Excellence in Real Estate Investment Services. One ecosystem. Trusted expertise. Results from capital to completion.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
