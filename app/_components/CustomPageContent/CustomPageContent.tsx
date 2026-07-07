"use client";

import { useEffect, useState } from "react";
import { useTina } from "tinacms/dist/react";
import type {
  GlobalQuery,
  GlobalQueryVariables,
  PageQuery,
  PageQueryVariables,
} from "@/tina/__generated__/types";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { renderPageSection, type PageSectionData } from "../PageSections";
import styles from "./customPageContent.module.css";

interface QueryResponse<TData, TVariables> {
  data: TData;
  query: string;
  variables: TVariables;
}

type PageResponse = QueryResponse<PageQuery, PageQueryVariables>;
type GlobalResponse = QueryResponse<GlobalQuery, GlobalQueryVariables>;

interface CustomPageContentProps {
  pageResponse: PageResponse;
  globalResponse: GlobalResponse;
}

export function CustomPageContent({
  pageResponse,
  globalResponse,
}: CustomPageContentProps) {
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    setIsPreview(window.self !== window.top);
  }, []);

  if (isPreview) {
    return (
      <EditableCustomPage
        pageResponse={pageResponse}
        globalResponse={globalResponse}
      />
    );
  }

  return (
    <RenderedCustomPage
      page={pageResponse.data.page}
      global={globalResponse.data.global}
    />
  );
}

// Only mounted (and useTina only ever called) when the page detects it's
// running inside Tina's own admin preview iframe — regular visitors never
// pay the deep-clone/tree-walk cost useTina does on every render.
function EditableCustomPage({
  pageResponse,
  globalResponse,
}: CustomPageContentProps) {
  const { data: pageData } = useTina(pageResponse);
  const { data: globalData } = useTina(globalResponse);

  return (
    <RenderedCustomPage page={pageData.page} global={globalData.global} />
  );
}

function RenderedCustomPage({
  page,
  global,
}: {
  page: PageQuery["page"];
  global: GlobalQuery["global"];
}) {
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
    <div className={`page-wrapper ${styles.customPage}`}>
      <Header navItems={navigationItems} />

      <main id="main-content" className={styles.mainContent}>
        {page.sections?.map(
          (section, i) =>
            // Tina's generated `PageSectionsSubHero.postReference` type
            // nominally requires the full `Insight` document shape
            // (including internal Document bookkeeping fields like
            // `_values` that only exist on top-level query results, not on
            // references embedded inside another document's query) — a
            // codegen inconsistency, not a real mismatch, so the cast here
            // is safe.
            section && renderPageSection(section as PageSectionData, i)
        )}
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
