import type { Metadata } from "next";
import { client } from "@/tina/__generated__/client";
import { HomePageContent } from "./_components/HomePageContent";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const homePageResponse = await client.queries.homePage({
    relativePath: "home.json",
  });
  const globalResponse = await client.queries.global({
    relativePath: "settings.json",
  });

  return (
    <HomePageContent
      homePageResponse={homePageResponse}
      globalResponse={globalResponse}
    />
  );
}
