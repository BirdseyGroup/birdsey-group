"use client";

import { useEffect, useState } from "react";
import { tinaField, useTina } from "tinacms/dist/react";
import type {
  GlobalQuery,
  GlobalQueryVariables,
  HomePageQuery,
  HomePageQueryVariables,
} from "@/tina/__generated__/types";
import { AffiliatesSection } from "../AffiliatesSection";
import { BrandShowcase } from "../BrandShowcase";
import { CareersSection } from "../CareersSection";
import { ContactSection } from "../ContactSection";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { HeroSection } from "../HeroSection";
import { NewsSection, resolveNewsArticle } from "../NewsSection";
import { PerformanceSection } from "../PerformanceSection";
import { resolveSubHeroLink, SubHeroSection } from "../SubHeroSection";

interface QueryResponse<TData, TVariables> {
  data: TData;
  query: string;
  variables: TVariables;
}

type HomePageResponse = QueryResponse<HomePageQuery, HomePageQueryVariables>;
type GlobalResponse = QueryResponse<GlobalQuery, GlobalQueryVariables>;

interface HomePageContentProps {
  homePageResponse: HomePageResponse;
  globalResponse: GlobalResponse;
}

export function HomePageContent({
  homePageResponse,
  globalResponse,
}: HomePageContentProps) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.self !== window.top);
  }, []);

  if (isPreview) {
    return (
      <EditableHomePage
        homePageResponse={homePageResponse}
        globalResponse={globalResponse}
      />
    );
  }

  return (
    <RenderedHomePage
      homePage={homePageResponse.data.homePage}
      global={globalResponse.data.global}
    />
  );
}

// Only mounted (and useTina only ever called) when the page detects it's
// running inside Tina's own admin preview iframe — regular visitors never
// pay the deep-clone/tree-walk cost useTina does on every render.
function EditableHomePage({
  homePageResponse,
  globalResponse,
}: HomePageContentProps) {
  const { data: homePageData } = useTina(homePageResponse);
  const { data: globalData } = useTina(globalResponse);

  return (
    <RenderedHomePage
      homePage={homePageData.homePage}
      global={globalData.global}
    />
  );
}

function RenderedHomePage({
  homePage,
  global,
}: {
  homePage: HomePageQuery["homePage"];
  global: GlobalQuery["global"];
}) {
  const hero = homePage.hero;
  const subHero = homePage.subHero;
  const subHeroLink = resolveSubHeroLink({
    link: subHero?.link,
    postReference: subHero?.postReference,
    linkTextTinaField: subHero?.link
      ? tinaField(subHero.link, "text")
      : undefined,
    postReferenceTinaField: subHero
      ? tinaField(subHero, "postReference")
      : undefined,
  });
  const affiliates = homePage.affiliates;
  const performance = homePage.performance;
  const news = homePage.news;
  const resolvedNewsArticles = (news?.articles ?? [])
    .filter((article) => article != null)
    .map((article) =>
      resolveNewsArticle(article, {
        title: tinaField(article, "title"),
        excerpt: tinaField(article, "excerpt"),
        image: tinaField(article, "image"),
        postReference: tinaField(article, "postReference"),
      })
    );
  const careers = homePage.careers;
  const contact = homePage.contact;

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
    <div className="page-wrapper">
      <Header navItems={navigationItems} />
      <main id="main-content">
        <HeroSection
          title={hero?.title || ""}
          titleTinaField={hero ? tinaField(hero, "title") : undefined}
          subtitle={hero?.subtitle || ""}
          subtitleTinaField={hero ? tinaField(hero, "subtitle") : undefined}
          primaryButton={hero?.primaryButton}
          primaryButtonTextTinaField={
            hero?.primaryButton
              ? tinaField(hero.primaryButton, "text")
              : undefined
          }
          secondaryButton={hero?.secondaryButton}
          secondaryButtonTextTinaField={
            hero?.secondaryButton
              ? tinaField(hero.secondaryButton, "text")
              : undefined
          }
        />
        <SubHeroSection
          title={subHero?.title || ""}
          titleTinaField={subHero ? tinaField(subHero, "title") : undefined}
          description={subHero?.description || ""}
          descriptionTinaField={
            subHero ? tinaField(subHero, "description") : undefined
          }
          link={subHeroLink.link}
          linkTextTinaField={subHeroLink.tinaField}
        />
        <AffiliatesSection
          sectionTitle={affiliates?.sectionTitle || ""}
          sectionTitleTinaField={
            affiliates ? tinaField(affiliates, "sectionTitle") : undefined
          }
          items={affiliates?.items?.filter((item) => item != null) ?? []}
          itemsTinaFields={affiliates?.items?.map((item) => ({
            logo: item ? tinaField(item, "logo") : undefined,
          }))}
        />
        <BrandShowcase
          heading={affiliates?.sectionHeading || ""}
          headingTinaField={
            affiliates ? tinaField(affiliates, "sectionHeading") : undefined
          }
          items={affiliates?.items?.filter((item) => item != null) ?? []}
          itemsTinaFields={affiliates?.items?.map((item) => ({
            title: item ? tinaField(item, "title") : undefined,
            subtitle: item ? tinaField(item, "subtitle") : undefined,
            description: item ? tinaField(item, "description") : undefined,
          }))}
        />
        <PerformanceSection
          title={performance?.title || ""}
          titleTinaField={
            performance ? tinaField(performance, "title") : undefined
          }
          stats={performance?.stats?.filter((stat) => stat != null) ?? []}
          statsTinaFields={performance?.stats?.map((stat) => ({
            value: stat ? tinaField(stat, "value") : undefined,
            label: stat ? tinaField(stat, "label") : undefined,
          }))}
        />
        <NewsSection
          title={news?.title || ""}
          titleTinaField={news ? tinaField(news, "title") : undefined}
          articles={resolvedNewsArticles.map((r) => r.article)}
          articlesTinaFields={resolvedNewsArticles.map((r) => r.tinaFields)}
        />
        <CareersSection
          title={careers?.title || ""}
          titleTinaField={careers ? tinaField(careers, "title") : undefined}
          content={careers?.content || ""}
          contentTinaField={
            careers ? tinaField(careers, "content") : undefined
          }
          email={careers?.email || ""}
          emailTinaField={careers ? tinaField(careers, "email") : undefined}
        />
        <ContactSection
          title={contact?.title || ""}
          titleTinaField={contact ? tinaField(contact, "title") : undefined}
          formTitle={contact?.formTitle || ""}
          formTitleTinaField={
            contact ? tinaField(contact, "formTitle") : undefined
          }
          formDescription={contact?.formDescription || ""}
          formDescriptionTinaField={
            contact ? tinaField(contact, "formDescription") : undefined
          }
          submitButtonText={contact?.submitButtonText || ""}
          submitButtonTextTinaField={
            contact ? tinaField(contact, "submitButtonText") : undefined
          }
        />
      </main>
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
