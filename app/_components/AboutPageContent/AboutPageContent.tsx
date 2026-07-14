"use client";

import { Suspense, useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type {
  AboutPageQuery,
  AboutPageQueryVariables,
  AffiliateConnectionQuery,
  AffiliateConnectionQueryVariables,
  GlobalQuery,
  GlobalQueryVariables,
  TeamMemberConnectionQuery,
  TeamMemberConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { ContactSection } from "../ContactSection";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { HeroSection } from "../HeroSection";
import { TeamSection } from "../TeamSection";
import styles from "./aboutPageContent.module.css";

interface QueryResponse<TData, TVariables> {
  data: TData;
  query: string;
  variables: TVariables;
}

type AboutResponse = QueryResponse<AboutPageQuery, AboutPageQueryVariables>;
type GlobalResponse = QueryResponse<GlobalQuery, GlobalQueryVariables>;
type TeamResponse = QueryResponse<
  TeamMemberConnectionQuery,
  TeamMemberConnectionQueryVariables
>;
type AffiliateResponse = QueryResponse<
  AffiliateConnectionQuery,
  AffiliateConnectionQueryVariables
>;

interface AboutPageContentProps {
  aboutResponse: AboutResponse;
  globalResponse: GlobalResponse;
  teamResponse: TeamResponse;
  affiliateResponse: AffiliateResponse;
}

export function AboutPageContent(props: AboutPageContentProps) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.self !== window.top);
  }, []);

  if (isPreview) {
    return <EditableAboutPage {...props} />;
  }

  return (
    <RenderedAboutPage
      aboutPage={props.aboutResponse.data.aboutPage}
      global={props.globalResponse.data.global}
      teamConnection={props.teamResponse.data.teamMemberConnection}
      affiliateConnection={props.affiliateResponse.data.affiliateConnection}
    />
  );
}

// Only mounted (and useTina only ever called) when the page detects it's
// running inside Tina's own admin preview iframe — regular visitors never
// pay the deep-clone/tree-walk cost useTina does on every render.
function EditableAboutPage({
  aboutResponse,
  globalResponse,
  teamResponse,
  affiliateResponse,
}: AboutPageContentProps) {
  const { data: aboutData } = useTina(aboutResponse);
  const { data: globalData } = useTina(globalResponse);
  const { data: teamData } = useTina(teamResponse);
  const { data: affiliateData } = useTina(affiliateResponse);

  return (
    <RenderedAboutPage
      aboutPage={aboutData.aboutPage}
      global={globalData.global}
      teamConnection={teamData.teamMemberConnection}
      affiliateConnection={affiliateData.affiliateConnection}
    />
  );
}

function RenderedAboutPage({
  aboutPage,
  global,
  teamConnection,
  affiliateConnection,
}: {
  aboutPage: AboutPageQuery["aboutPage"];
  global: GlobalQuery["global"];
  teamConnection: TeamMemberConnectionQuery["teamMemberConnection"];
  affiliateConnection: AffiliateConnectionQuery["affiliateConnection"];
}) {
  const hero = aboutPage.hero;
  const contact = aboutPage.contact;

  const accordionItems = (aboutPage.accordionItems ?? [])
    .filter((item) => item != null)
    .map((item) => ({
      title: item.title,
      content: item.content,
      titleTinaField: tinaField(item, "title"),
      contentTinaField: tinaField(item, "content"),
    }));

  const affiliates = (affiliateConnection.edges ?? [])
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((node) => ({
      name: node.name,
      shortName: node.shortName,
      slug: node.slug,
    }));

  const teamMembers = (teamConnection.edges ?? [])
    .flatMap((edge) => (edge?.node ? [edge.node] : []))
    .map((node) => {
      // The affiliate reference is expanded to the full Team Group document
      // by the generated query; during live editing it can briefly be a raw
      // path string until Tina re-expands it.
      const group = node.affiliate as
        | { slug?: string }
        | string
        | null
        | undefined;
      const groupSlug =
        typeof group === "object" && group?.slug
          ? group.slug
          : typeof group === "string"
            ? (group.split("/").pop()?.replace(/\.json$/, "") ?? "")
            : "";

      return {
        name: node.name,
        title: node.title,
        photo: node.photo ?? undefined,
        order: node.order,
        affiliate: groupSlug,
        bio: node.bio,
        email: node.email ?? undefined,
        phone: node.phone ?? undefined,
        linkedinUrl: node.linkedinUrl ?? undefined,
        miniBioEnabled: node.miniBioEnabled ?? undefined,
        profilePageEnabled: node.profilePageEnabled ?? undefined,
        // The JSON filename is the team-member slug (drives /team/[slug]).
        slug: node._sys.filename,
        tinaField: tinaField(node),
      };
    });

  const navigationItems = (global.navigation?.items ?? []).filter(
    (item) => item != null
  );
  const footer = global.footer;
  const footerNavExtras = (footer?.footerNavExtras ?? []).filter(
    (item) => item != null
  );
  const footerLinks = (footer?.footerLinks ?? [])
    .filter((item) => item != null)
    .map((item) => ({
      ...item,
      openCookieSettings: item.openCookieSettings ?? undefined,
    }));

  return (
    <div className={`page-wrapper ${styles.aboutPage}`}>
      <Header navItems={navigationItems} />

      {hero && (
        <HeroSection
          title={hero.title}
          titleTinaField={tinaField(hero, "title")}
          subtitle={hero.subtitle}
          subtitleTinaField={tinaField(hero, "subtitle")}
          backgroundImage={hero.backgroundImage ?? undefined}
          variant="simple"
        />
      )}

      <main id="main-content" className={styles.mainContent}>
        <div className={styles.container}>
          <Suspense fallback={<div>Loading...</div>}>
            <TeamSection
              accordionItems={accordionItems}
              affiliates={affiliates}
              teamMembers={teamMembers}
            />
          </Suspense>
        </div>
      </main>

      {contact && (
        <ContactSection
          title={contact.title}
          titleTinaField={tinaField(contact, "title")}
          formTitle={contact.formTitle}
          formTitleTinaField={tinaField(contact, "formTitle")}
          formDescription={contact.formDescription}
          formDescriptionTinaField={tinaField(contact, "formDescription")}
          submitButtonText={contact.submitButtonText}
          submitButtonTextTinaField={tinaField(contact, "submitButtonText")}
        />
      )}

      <Footer
        phone={footer?.phone || ""}
        email={footer?.email || ""}
        address={footer?.address || ""}
        copyright={footer?.copyright || ""}
        navItems={navigationItems}
        footerNavExtras={footerNavExtras}
        footerLinks={footerLinks}
      />
    </div>
  );
}
