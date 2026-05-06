import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

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
  schema: {
    collections: [
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
            ],
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
        name: "page",
        label: "Pages",
        path: "content/pages",
        match: {
          exclude: "about",
        },
        format: "json",
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
            ],
          },
          {
            type: "object",
            name: "subHero",
            label: "Sub Hero Section",
            fields: [
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
            ],
          },
          {
            type: "object",
            name: "affiliates",
            label: "Affiliates",
            fields: [
              {
                type: "string",
                name: "sectionTitle",
                label: "Section Title",
                required: true,
              },
              {
                type: "object",
                name: "items",
                label: "Affiliate Companies",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Company Title",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "subtitle",
                    label: "Subtitle",
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
            ],
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
            fields: [
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
                fields: [
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
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Title",
                    required: true,
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
                    type: "image",
                    name: "image",
                    label: "Article Image",
                  },
                  {
                    type: "string",
                    name: "url",
                    label: "Article URL",
                    required: true,
                  },
                ],
              },
            ],
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
            fields: [
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
            ],
          },
        ],
      },
      {
        name: "affiliate",
        label: "Affiliates",
        path: "content/affiliates",
        format: "json",
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
            name: "shortName",
            label: "Short Name (for tabs)",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
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
            label: "Affiliate Company",
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
            type: "number",
            name: "order",
            label: "Display Order",
            required: true,
          },
        ],
      },
      {
        name: "insight",
        label: "Insights Articles",
        path: "content/insights",
        format: "json",
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
            name: "slug",
            label: "URL Slug",
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
    ],
  },
});
