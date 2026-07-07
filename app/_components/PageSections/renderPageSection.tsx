import { tinaField } from "tinacms/dist/react";
import type { PageSections } from "@/tina/__generated__/types";
import { AffiliatesSection } from "../AffiliatesSection";
import { ContactSection } from "../ContactSection";
import { HeroSection } from "../HeroSection";
import { NewsSection, resolveNewsArticle } from "../NewsSection";
import { resolveSubHeroLink, SubHeroSection } from "../SubHeroSection";

export type PageSectionData = PageSections;

// Tina's generated `postReference` type nominally requires the full
// `Insight` document shape (including internal Document bookkeeping fields
// like `_values` that only exist on top-level query results, not on
// references embedded inside another document's query). The real embedded
// value always structurally has what we actually use, so narrow it here
// rather than fight the nominal type.
interface SubHeroPostReference {
  title: string;
  _sys: { filename: string };
}

interface NewsArticlePostReference {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string | null;
  _sys: { filename: string };
}

export function renderPageSection(section: PageSectionData, key: number) {
  switch (section.__typename) {
    case "PageSectionsHero":
      return (
        <HeroSection
          key={key}
          title={section.title}
          titleTinaField={tinaField(section, "title")}
          subtitle={section.subtitle}
          subtitleTinaField={tinaField(section, "subtitle")}
          backgroundImage={section.backgroundImage || undefined}
          primaryButton={section.primaryButton}
          primaryButtonTextTinaField={
            section.primaryButton
              ? tinaField(section.primaryButton, "text")
              : undefined
          }
          secondaryButton={section.secondaryButton}
          secondaryButtonTextTinaField={
            section.secondaryButton
              ? tinaField(section.secondaryButton, "text")
              : undefined
          }
        />
      );
    case "PageSectionsSubHero": {
      const resolvedLink = resolveSubHeroLink({
        link: section.link,
        postReference: section.postReference as
          | SubHeroPostReference
          | string
          | null,
        linkTextTinaField: section.link
          ? tinaField(section.link, "text")
          : undefined,
        postReferenceTinaField: tinaField(section, "postReference"),
      });
      return (
        <SubHeroSection
          key={key}
          title={section.title}
          titleTinaField={tinaField(section, "title")}
          description={section.description}
          descriptionTinaField={tinaField(section, "description")}
          link={resolvedLink.link}
          linkTextTinaField={resolvedLink.tinaField}
        />
      );
    }
    case "PageSectionsAffiliates":
      return (
        <AffiliatesSection
          key={key}
          sectionTitle={section.sectionTitle}
          sectionTitleTinaField={tinaField(section, "sectionTitle")}
          items={(section.items ?? []).filter((item) => item != null)}
          itemsTinaFields={section.items?.map((item) => ({
            logo: item ? tinaField(item, "logo") : undefined,
          }))}
        />
      );
    case "PageSectionsNews": {
      const resolvedArticles = (section.articles ?? [])
        .filter((article) => article != null)
        .map((article) =>
          resolveNewsArticle(
            {
              ...article,
              postReference: article.postReference as
                | NewsArticlePostReference
                | string
                | null,
            },
            {
              title: tinaField(article, "title"),
              excerpt: tinaField(article, "excerpt"),
              image: tinaField(article, "image"),
              postReference: tinaField(article, "postReference"),
            }
          )
        );
      return (
        <NewsSection
          key={key}
          title={section.title}
          titleTinaField={tinaField(section, "title")}
          articles={resolvedArticles.map((r) => r.article)}
          articlesTinaFields={resolvedArticles.map((r) => r.tinaFields)}
        />
      );
    }
    case "PageSectionsContact":
      return (
        <ContactSection
          key={key}
          title={section.title}
          titleTinaField={tinaField(section, "title")}
          formTitle={section.formTitle}
          formTitleTinaField={tinaField(section, "formTitle")}
          formDescription={section.formDescription}
          formDescriptionTinaField={tinaField(section, "formDescription")}
          submitButtonText={section.submitButtonText}
          submitButtonTextTinaField={tinaField(section, "submitButtonText")}
        />
      );
    default:
      return null;
  }
}
