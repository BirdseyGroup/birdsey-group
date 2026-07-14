import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { client } from "@/tina/__generated__/client";
import { AboutPageContent } from "../_components/AboutPageContent";

export const metadata: Metadata = {
  title: "About Birdsey Group",
  description:
    "Many of our clients consider our company as an extension of their own staff. Meet the Birdsey Group team across Corporate, Commercial, Residential, Construction, and Board of Advisors.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const aboutResponse = await client.queries.aboutPage({
    relativePath: "about.json",
  });
  const globalResponse = await client.queries.global({
    relativePath: "settings.json",
  });
  // Explicit `first`: the team is well past Tina's default connection page
  // size, and a silently truncated list would drop people from the grid.
  const teamResponse = await client.queries.teamMemberConnection({
    first: 500,
  });
  const affiliateResponse = await client.queries.affiliateConnection({
    first: 100,
  });

  const heroImage = aboutResponse.data.aboutPage.hero?.backgroundImage;
  if (heroImage) {
    ReactDOM.preload(heroImage, {
      as: "image",
      fetchPriority: "high",
    });
  }

  return (
    <AboutPageContent
      aboutResponse={aboutResponse}
      globalResponse={globalResponse}
      teamResponse={teamResponse}
      affiliateResponse={affiliateResponse}
    />
  );
}
