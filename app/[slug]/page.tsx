import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { client } from "@/tina/__generated__/client";
import { CustomPageContent } from "../_components/CustomPageContent";

interface CustomPageProps {
  params: Promise<{ slug: string }>;
}

interface ResolvedPage {
  relativePath: string;
  canonicalUrl: string;
}

// The live URL is an editor-controlled field (`url`), independent of the
// filename Tina generates from the title. Public traffic should only ever
// resolve by that field. Tina's own admin, though, still opens its preview
// iframe using the document's filename — so a slug that doesn't match any
// `url` field is also tried as a filename, and redirected to the real
// canonical URL if found, rather than rendered at the mismatched path.
async function resolvePage(slug: string): Promise<ResolvedPage | null> {
  const { data: connectionData } = await client.queries.pageConnection({
    filter: { url: { eq: slug } },
  });

  const matchByUrl = connectionData.pageConnection.edges?.find(
    (edge) => edge?.node
  )?.node;

  if (matchByUrl) {
    return { relativePath: matchByUrl._sys.relativePath, canonicalUrl: slug };
  }

  try {
    const { data } = await client.queries.page({
      relativePath: `${slug}.json`,
    });
    return { relativePath: `${slug}.json`, canonicalUrl: data.page.url };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CustomPageProps): Promise<Metadata> {
  const { slug } = await params;

  const resolved = await resolvePage(slug);
  if (!resolved) return {};

  const { data } = await client.queries.page({
    relativePath: resolved.relativePath,
  });

  return {
    title: `${data.page.title} | Birdsey Group`,
    description: data.page.metaDescription || undefined,
    alternates: { canonical: `/${resolved.canonicalUrl}` },
  };
}

export async function generateStaticParams() {
  const slugs: string[] = [];
  let after: string | undefined;

  do {
    const { data } = await client.queries.pageConnection({ after });
    for (const edge of data.pageConnection.edges ?? []) {
      if (edge?.node?.url) slugs.push(edge.node.url);
    }
    after = data.pageConnection.pageInfo.hasNextPage
      ? data.pageConnection.pageInfo.endCursor
      : undefined;
  } while (after);

  return slugs.map((slug) => ({ slug }));
}

export default async function CustomPage({ params }: CustomPageProps) {
  const { slug } = await params;

  const resolved = await resolvePage(slug);
  if (!resolved) notFound();

  if (resolved.canonicalUrl !== slug) {
    redirect(`/${resolved.canonicalUrl}`);
  }

  const pageResponse = await client.queries.page({
    relativePath: resolved.relativePath,
  });
  const globalResponse = await client.queries.global({
    relativePath: "settings.json",
  });

  return (
    <CustomPageContent
      pageResponse={pageResponse}
      globalResponse={globalResponse}
    />
  );
}
