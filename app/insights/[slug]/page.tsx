import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/tina/__generated__/client";
import { InsightContent } from "../../_components/InsightContent";

interface InsightPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;

  let article;
  try {
    const { data } = await client.queries.insight({
      relativePath: `${slug}.json`,
    });
    article = data.insight;
  } catch {
    return {};
  }

  const url = `https://www.birdseygroup.com/insights/${slug}`;

  return {
    title: `${article.title} | Birdsey Group`,
    description: article.excerpt,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      ...(article.image && {
        images: [
          {
            url: `https://www.birdseygroup.com${article.image}`,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.image && {
        images: [`https://www.birdseygroup.com${article.image}`],
      }),
    },
  };
}

export async function generateStaticParams() {
  const slugs: string[] = [];
  let after: string | undefined;

  do {
    const { data } = await client.queries.insightConnection({ after });
    for (const edge of data.insightConnection.edges ?? []) {
      if (edge?.node?._sys.filename) slugs.push(edge.node._sys.filename);
    }
    after = data.insightConnection.pageInfo.hasNextPage
      ? data.insightConnection.pageInfo.endCursor
      : undefined;
  } while (after);

  return slugs.map((slug) => ({ slug }));
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;

  let insightResponse;
  try {
    insightResponse = await client.queries.insight({
      relativePath: `${slug}.json`,
    });
  } catch {
    notFound();
  }

  const globalResponse = await client.queries.global({
    relativePath: "settings.json",
  });

  return (
    <InsightContent
      insightResponse={insightResponse}
      globalResponse={globalResponse}
    />
  );
}
