import { createElement } from "react";
import { defineConfig, type TinaField } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// Turns a human-entered value into a URL-safe file name.
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Shows the Insight's thumbnail, title, and a truncated excerpt in the
// reference picker dropdown, instead of Tina's default of the raw file path.
const insightOptionComponent = (props: Record<string, unknown>) => {
  const title =
    (props?.title as string | undefined) ||
    (props?._sys as { filename?: string } | undefined)?.filename ||
    "Untitled";
  const excerpt = props?.excerpt as string | undefined;
  const image = props?.image as string | undefined;
  const truncated =
    excerpt && excerpt.length > 80
      ? `${excerpt.slice(0, 80).trimEnd()}…`
      : excerpt;

  const textColumn = createElement(
    "div",
    undefined,
    createElement("div", undefined, title),
    truncated
      ? createElement(
          "div",
          { style: { fontSize: "0.8em", color: "#6b7280", marginTop: 2 } },
          truncated
        )
      : undefined
  );

  if (!image) return textColumn;

  return createElement(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 10 } },
    createElement("img", {
      src: image,
      alt: "",
      style: {
        width: 40,
        height: 40,
        objectFit: "cover",
        borderRadius: 4,
        flexShrink: 0,
      },
    }),
    textColumn
  );
};

// Shows the affiliate company's logo and name in the reference picker
// dropdown, instead of Tina's default of the raw file path.
const affiliateCompanyOptionComponent = (props: Record<string, unknown>) => {
  const name =
    (props?.name as string | undefined) ||
    (props?._sys as { filename?: string } | undefined)?.filename ||
    "Untitled";
  const logo = props?.logo as string | undefined;

  if (!logo) return name;

  return createElement(
    "div",
    { style: { display: "flex", alignItems: "center", gap: 10 } },
    createElement("img", {
      src: logo,
      alt: "",
      style: { width: 40, height: 40, objectFit: "contain", flexShrink: 0 },
    }),
    createElement("div", undefined, name)
  );
};

// Shared field shapes for section types that appear both on the Home Page
// (fixed fields) and as blocks in the flexible Custom Pages collection.
// Defined once here so the two stay in sync instead of drifting apart.
const heroSectionFields: TinaField[] = [
  {
    type: "string",
    name: "title",
    label: "Title",
    required: true,
  },
  {
    type: "string",
    name: "subtitle",
    label: "Subtitle",
    required: true,
  },
  {
    type: "object",
    name: "primaryButton",
    label: "Primary Button",
    fields: [
      {
        type: "string",
        name: "text",
        label: "Text",
      },
      {
        type: "string",
        name: "href",
        label: "Link",
      },
    ],
  },
  {
    type: "object",
    name: "secondaryButton",
    label: "Secondary Button",
    fields: [
      {
        type: "string",
        name: "text",
        label: "Text",
      },
      {
        type: "string",
        name: "href",
        label: "Link",
      },
    ],
  },
];

const subHeroSectionFields: TinaField[] = [
  {
    type: "string",
    name: "title",
    label: "Title",
    required: true,
  },
  {
    type: "string",
    name: "description",
    label: "Description",
    required: true,
    ui: {
      component: "textarea",
    },
  },
  {
    type: "object",
    name: "link",
    label: "Link",
    description:
      "Used when \"Link to a Post\" below is left empty — for external links or in-page anchors like #services.",
    fields: [
      {
        type: "string",
        name: "text",
        label: "Text",
      },
      {
        type: "string",
        name: "href",
        label: "URL",
      },
    ],
  },
  {
    type: "reference",
    name: "postReference",
    label: "Link to a Post",
    description:
      "Optional — pick a News article to link to instead of the manual Link above. Takes precedence over Link when set.",
    collections: ["insight"],
    ui: { optionComponent: insightOptionComponent },
  },
];

const affiliatesSectionFields: TinaField[] = [
  {
    type: "string",
    name: "sectionTitle",
    label: "Section Title",
    required: true,
  },
  {
    type: "string",
    name: "sectionHeading",
    label: "Services Section Heading",
    description: "Heading for the scrolling brand showcase (Home Page only).",
  },
  {
    type: "object",
    name: "items",
    label: "Affiliate Companies",
    description:
      "Which companies appear in this section, and in what order. Edit a company's logo, text, and links in the Affiliate Companies collection.",
    list: true,
    ui: {
      itemProps: (item) => {
        const filename =
          typeof item?.company === "string"
            ? item.company.split("/").pop()?.replace(/\.json$/, "")
            : undefined;
        return {
          label: filename
            ? filename.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
            : "Affiliate Company",
        };
      },
    },
    fields: [
      {
        type: "reference",
        name: "company",
        label: "Company",
        required: true,
        collections: ["affiliateCompany"],
        ui: { optionComponent: affiliateCompanyOptionComponent },
      },
    ],
  },
];

const newsSectionFields: TinaField[] = [
  {
    type: "string",
    name: "title",
    label: "Section Title",
    required: true,
  },
  {
    type: "object",
    name: "articles",
    label: "Articles",
    list: true,
    ui: {
      itemProps: (item) => ({
        label:
          item?.title ||
          (typeof item?.postReference === "string"
            ? item.postReference.split("/").pop()?.replace(/\.json$/, "")
            : undefined) ||
          "Untitled Article",
      }),
    },
    fields: [
      {
        type: "reference",
        name: "postReference",
        label: "News Article",
        description:
          "Pick a News article to pull its date/category/title/excerpt/image/link from automatically. Any field filled in manually below overrides that article's value.",
        collections: ["insight"],
        ui: { optionComponent: insightOptionComponent },
      },
      {
        type: "string",
        name: "date",
        label: "Date",
      },
      {
        type: "boolean",
        name: "hideDate",
        label: "Hide date on card",
      },
      {
        type: "string",
        name: "category",
        label: "Category",
      },
      {
        type: "string",
        name: "title",
        label: "Title",
      },
      {
        type: "string",
        name: "excerpt",
        label: "Excerpt",
        ui: {
          component: "textarea",
        },
      },
      {
        type: "image",
        name: "image",
        label: "Article Image",
      },
      {
        type: "string",
        name: "url",
        label: "Article URL",
      },
    ],
  },
];

const contactSectionFields: TinaField[] = [
  {
    type: "string",
    name: "title",
    label: "Section Title",
    required: true,
  },
  {
    type: "string",
    name: "formTitle",
    label: "Form Title",
    required: true,
  },
  {
    type: "string",
    name: "formDescription",
    label: "Form Description",
    required: true,
  },
  {
    type: "string",
    name: "submitButtonText",
    label: "Submit Button Text",
    required: true,
  },
];

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  contentApiUrlOverride: process.env.TINA_PUBLIC_IS_LOCAL === "true"
    ? "http://localhost:4001/graphql"
    : undefined,
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  // Collection order here is the order shown in the admin sidebar.
  schema: {
    collections: [
      {
        name: "homePage",
        label: "Home Page",
        path: "content/pages",
        match: {
          include: "home",
        },
        format: "json",
        ui: {
          router: () => "/",
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: heroSectionFields,
          },
          {
            type: "object",
            name: "subHero",
            label: "Sub Hero Section",
            fields: subHeroSectionFields,
          },
          {
            type: "object",
            name: "affiliates",
            label: "Affiliates",
            fields: affiliatesSectionFields,
          },
          {
            type: "object",
            name: "performance",
            label: "Performance Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title",
                required: true,
              },
              {
                type: "object",
                name: "stats",
                label: "Statistics",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label:
                      item?.value && item?.label
                        ? `${item.value} ${item.label}`
                        : item?.label || "Statistic",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "value",
                    label: "Value",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "news",
            label: "News Section",
            fields: newsSectionFields,
          },
          {
            type: "object",
            name: "careers",
            label: "Careers Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "content",
                label: "Content",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "email",
                label: "Careers Email",
                required: true,
              },
              {
                type: "image",
                name: "image",
                label: "Section Image",
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Section",
            fields: contactSectionFields,
          },
        ],
      },
      {
        name: "aboutPage",
        label: "About Page",
        path: "content/pages",
        match: {
          include: "about",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Hero Title",
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Hero Subtitle",
                required: true,
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
              },
            ],
          },
          {
            type: "string",
            name: "heading",
            label: "Page Heading",
            required: true,
          },
          {
            type: "object",
            name: "accordionItems",
            label: "Accordion Sections",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "Accordion Section",
              }),
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Section Title",
                required: true,
              },
              {
                type: "string",
                name: "content",
                label: "Section Content",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "string",
            name: "teamSectionTitle",
            label: "Team Section Title",
            required: true,
          },
        ],
      },
      {
        name: "birdseyStandardPage",
        label: "Birdsey Standard Page",
        path: "content/pages",
        match: {
          include: "birdsey-standard",
        },
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            isTitle: true,
            required: true,
          },
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                required: true,
              },
            ],
          },
          {
            type: "string",
            name: "intro",
            label: "Intro Text",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "sections",
            label: "Body Sections",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.heading || "Body Section",
              }),
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
              },
              {
                type: "string",
                name: "body",
                label: "Body",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "string",
            name: "principlesTitle",
            label: "Principles Section Title",
            required: true,
          },
          {
            type: "string",
            name: "principlesIntro",
            label: "Principles Intro",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "principles",
            label: "Principles",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Principle",
              }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Name",
                required: true,
              },
              {
                type: "string",
                name: "body",
                label: "Body",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "commitments",
            label: "Commitments",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.heading || "Commitment",
              }),
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
              },
              {
                type: "string",
                name: "body",
                label: "Body",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "infoBlocks",
            label: "Info Blocks",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.heading || "Info Block",
              }),
            },
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
              },
              {
                type: "string",
                name: "body",
                label: "Body",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "closing",
            label: "Closing Section",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
                required: true,
              },
              {
                type: "string",
                name: "body",
                label: "Body",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "formTitle",
                label: "Form Title",
                required: true,
              },
              {
                type: "string",
                name: "formDescription",
                label: "Form Description",
                required: true,
              },
              {
                type: "string",
                name: "submitButtonText",
                label: "Submit Button Text",
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "page",
        label: "Custom Pages",
        path: "content/custom-pages",
        format: "json",
        ui: {
          router: ({ document }) => {
            const url = (document as unknown as { url?: string }).url;
            return `/${url || document._sys.breadcrumbs.join("/")}`;
          },
          filename: {
            slugify: (values) =>
              slugify(
                (values?.url as string) || (values?.title as string) || ""
              ),
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "url",
            label: "URL",
            description:
              'The page\'s live URL path, without a leading slash (e.g. "thanks" for /thanks).',
            required: true,
          },
          {
            type: "string",
            name: "metaDescription",
            label: "Meta Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            // Each template sets ui.defaultItem so a freshly added block is
            // born with its required fields filled in. Tina does not stop a
            // save when a new block's required fields are empty, and the
            // GraphQL schema treats them as non-nullable — an empty block
            // breaks every production build until fixed.
            templates: [
              {
                name: "hero",
                label: "Hero",
                ui: {
                  defaultItem: {
                    title: "New hero title",
                    subtitle: "Add a subtitle",
                  },
                },
                // Custom pages get an extra Background Image option on top
                // of the shared fields — the Home Page hero always uses its
                // component's built-in default image instead.
                fields: [
                  ...heroSectionFields,
                  {
                    type: "image",
                    name: "backgroundImage",
                    label: "Background Image",
                  },
                ],
              },
              {
                name: "subHero",
                label: "Sub Hero",
                ui: {
                  defaultItem: {
                    title: "New section title",
                    description: "Add a description",
                  },
                },
                fields: subHeroSectionFields,
              },
              {
                name: "affiliates",
                label: "Affiliates",
                ui: {
                  defaultItem: {
                    sectionTitle: "Our Affiliate Companies",
                  },
                },
                fields: affiliatesSectionFields,
              },
              {
                name: "news",
                label: "News",
                ui: {
                  defaultItem: {
                    title: "News",
                  },
                },
                fields: newsSectionFields,
              },
              {
                name: "contact",
                label: "Contact",
                ui: {
                  defaultItem: {
                    title: "Contact Us",
                    formTitle: "Get in Touch",
                    formDescription:
                      "Send us a message and we will get back to you shortly.",
                    submitButtonText: "Submit",
                  },
                },
                fields: contactSectionFields,
              },
            ],
          },
        ],
      },
      {
        name: "insight",
        label: "News Articles",
        path: "content/insights",
        format: "json",
        ui: {
          router: ({ document }) =>
            `/insights/${document._sys.breadcrumbs.join("/")}`,
          filename: {
            slugify: (values) => slugify((values?.title as string) || ""),
            description:
              "The file name becomes the article's web address: /insights/<file-name>",
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: [
              "INSIGHT",
              "EXECUTION INSIGHT",
              "EXECUTION BRIEF",
              "RELATIONSHIP STANDARD INSIGHT",
            ],
          },
          {
            type: "string",
            name: "excerpt",
            label: "Excerpt",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Article Body",
            required: true,
            parser: { type: "slatejson" },
          },
          {
            type: "image",
            name: "image",
            label: "Featured Image",
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
          },
        ],
      },
      {
        name: "teamMember",
        label: "Team Members",
        path: "content/team",
        format: "json",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "title",
            label: "Job Title",
            required: true,
          },
          {
            type: "reference",
            name: "affiliate",
            label: "Team Group",
            description:
              "Which About-page tab this person appears under.",
            required: true,
            collections: ["affiliate"],
          },
          {
            type: "image",
            name: "photo",
            label: "Photo",
          },
          {
            type: "rich-text",
            name: "bio",
            label: "Biography",
            required: true,
          },
          {
            type: "string",
            name: "email",
            label: "Email",
          },
          {
            type: "string",
            name: "phone",
            label: "Phone",
          },
          {
            type: "string",
            name: "linkedinUrl",
            label: "LinkedIn URL",
          },
          {
            type: "boolean",
            name: "miniBioEnabled",
            label: "Mini bio enabled",
            description:
              "Show a 'Mini bio' link on this card. Leave off until a bio has been written.",
          },
          {
            type: "boolean",
            name: "profilePageEnabled",
            label: "Dedicated profile page",
            description:
              "Publish a /team/{slug} page for this person. The View Profile card link will route there instead of LinkedIn.",
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            required: true,
          },
        ],
      },
      {
        name: "affiliateCompany",
        label: "Affiliate Companies",
        path: "content/affiliate-companies",
        format: "json",
        ui: {
          filename: {
            slugify: (values) => slugify((values?.name as string) || ""),
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Company Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "title",
            label: "Card Title",
            description:
              'First line on the brand card, e.g. "Commercial Real Estate".',
            required: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "Card Subtitle",
            description: 'Second line on the brand card, e.g. "Debt Products".',
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "logo",
            label: "Logo Image",
            required: true,
          },
          {
            type: "image",
            name: "slideImage",
            label: "Slide Image",
            required: true,
          },
          {
            type: "string",
            name: "website",
            label: "Website URL",
            required: true,
          },
        ],
      },
      {
        name: "affiliate",
        label: "Team Groups (About Page)",
        path: "content/affiliates",
        format: "json",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Group Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "shortName",
            label: "Short Name (for tabs)",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            description:
              "Must match this entry's file name; used to group team members into About-page tabs.",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            required: true,
          },
        ],
      },
      {
        name: "legalPage",
        label: "Legal Pages",
        path: "content/legal",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "lastUpdated",
            label: "Last Updated",
            description: "Displayed under the title, e.g. \"July 2026\"",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            required: true,
            parser: { type: "slatejson" },
          },
        ],
      },
      {
        name: "global",
        label: "Global Settings",
        path: "content/global",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            fields: [
              {
                type: "object",
                name: "items",
                label: "Navigation Items",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label || "Navigation Item",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "Link",
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              {
                type: "string",
                name: "phone",
                label: "Phone Number",
                required: true,
              },
              {
                type: "string",
                name: "email",
                label: "Email Address",
                required: true,
              },
              {
                type: "string",
                name: "address",
                label: "Address",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "copyright",
                label: "Copyright Text",
                required: true,
              },
              {
                type: "object",
                name: "footerNavExtras",
                label: "Footer Company Links (extras, below main nav)",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label || "Footer Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                ],
              },
              {
                type: "object",
                name: "footerLinks",
                label: "Footer Legal Links (bottom row)",
                list: true,
                ui: {
                  itemProps: (item) => ({
                    label: item?.label || "Footer Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                  {
                    type: "boolean",
                    name: "openCookieSettings",
                    label: "Opens cookie settings (instead of linking)",
                    description:
                      "If checked, clicking this link reopens the cookie consent banner instead of navigating to the URL above.",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "cookieBanner",
            label: "Cookie Consent Banner",
            fields: [
              {
                type: "string",
                name: "message",
                label: "Message",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "acceptLabel",
                label: "Accept Button Label",
                required: true,
              },
              {
                type: "string",
                name: "declineLabel",
                label: "Decline Button Label",
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
});
