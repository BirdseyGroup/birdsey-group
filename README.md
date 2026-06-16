# Birdsey Group Website

Marketing website for the Birdsey Group, a real estate consulting firm. Built with Next.js 16 (App Router) on top of Figma's Simple Design System (SDS), with content managed in [TinaCMS](https://tina.io) and design-to-code wiring via Figma [Code Connect](https://github.com/figma/code-connect).

The homepage is a single long scroll page assembled from content sections; About, Insights, and Team are separate routes. All editable copy lives as JSON in [content/](./content/) and is read server-side in React Server Components, so the site builds to static output while remaining editable through the TinaCMS admin.

The SDS, Code Connect, and Figma sync foundations from the original design system are retained — see the [Figma](#figma-auth) and [Scripts](#scripts) sections below.

## Setup

- `npm i` to install dependencies
- Copy [.env.example](./.env.example) to `.env` and fill it in (see [Environment](#environment))
- `npm run dev` runs **TinaCMS + Next.js** together at [localhost:8000](http://localhost:8000) — use this for normal development so content editing works
- `npm run app:dev` runs Next.js **only** (no TinaCMS) at [localhost:8000](http://localhost:8000)
- `npm run storybook` starts Storybook at [localhost:6006](http://localhost:6006)
- `npm run app:lint` runs ESLint
- `npm run build` builds TinaCMS, Storybook, and the Next.js app

### Environment

Copy [.env.example](./.env.example) to `.env` and fill in:

- `NEXT_PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` — TinaCMS (admin at `/admin`)
- `TINA_PUBLIC_IS_LOCAL=true` — edit content against local files during development
- `FIGMA_ACCESS_TOKEN` / `FIGMA_FILE_KEY` — only needed to run the Figma sync [scripts](#scripts)

## Content Management (TinaCMS)

Content is stored as JSON in [content/](./content/) and edited through the TinaCMS admin at `/admin`. Collections are defined in [tina/config.ts](./tina/config.ts):

- `content/global/settings.json` — navigation and footer
- `content/pages/` — `home.json` (the homepage's section-by-section content) and `about.json`
- `content/insights/` — articles, rendered at `/insights/[slug]`
- `content/team/` — staff profiles, rendered at `/team/[slug]`
- `content/affiliates/` — affiliated companies

Pages read these files with `fs`/`path` at the top of the route component and pass the parsed JSON down as props; follow the same server-side load pattern when adding a page. The contact form (`ContactSection`) submits from the browser via [Forminit](https://forminit.com) and redirects to `/thank-you`.

## Figma & Code Connect

This site is built on Figma's Simple Design System. Tokens, icons, and Code Connect mappings stay in sync with the Figma file via the auth and scripts below. The original SDS [Figma Community File](https://www.figma.com/community/file/1380235722331273046/simple-design-system) documents the underlying system.

### Figma Auth

- [Create a Figma API token](https://www.figma.com/developers/api#authentication)
  - Add Code Connect scope
  - Add File Read, Dev Resources Write, and Variables scopes if you want to use the integrations in [scripts](./scripts/)
  - [More on scopes](https://www.figma.com/developers/api#authentication-scopes)
- In your `.env` (copied from [.env.example](./.env.example)):
  - Set `FIGMA_ACCESS_TOKEN=` as your token
  - Set `FIGMA_FILE_KEY=` as your file's key (grab it from the file URL)

### Code Connect

SDS is fully backed by Figma's Code Connect. This includes examples for how to connect [primitives](./src/figma/primitives/), as well as [compositions](./src/figma/compositions/) of those primitives for your design system.

This repo utilizes `documentUrlSubstitutions` in [figma.config.json](./figma.config.json). This allows us to keep our docs Figma file-agnostic and colocates all the Figma file-specific information for easy url swapping. The document URL substitutions are also named in a way that helps you find the associated component without clicking a link. A key `<FIGMA_INPUTS_CHECKBOX_GROUP>` is broken down as `<FIGMA_[PAGE_NAME]_[COMPONENT_NAME]>`.

```json
{
  "documentUrlSubstitutions": {
    "<FIGMA_INPUTS_CHECKBOX_GROUP>": "https://figma.com/design/whatever?node-id=123-456"
  }
}
```

Allows us to have more expressive URLs in our Code Connect docs:

```js
figma.connect(CheckboxGroup, "<FIGMA_INPUTS_CHECKBOX_GROUP>");
```

### Connecting this repo to a duplicated Figma file

With the above in mind, a fresh clone of the Simple Design System Figma file should maintain all the node-ids. The steps should be as follows:

- Duplicate the [Figma Community File](https://www.figma.com/community/file/1380235722331273046/simple-design-system)
- Clone this repo
- Update urls in [figma.config.json](./figma.config.json) to point to your Figma file
  - Note: the file keys (eg. `J0KLPKXiONDRssXD1AX9Oi`) should be the only change in the urls unless you're creating new components, detaching and recreating.
- Create and set your [Figma Auth Token](#figma-auth)
- At that point, `npx figma connect publish` should work and your new file should have Code Connect.

## Structure

This Next.js project follows a structured organization optimized for design systems:

### [app/](./app/)

Next.js App Router pages, layouts, and route handlers. `app/_components/` holds page-specific components (Header, Footer, the homepage section components, ContactSection, etc.); `app/_contexts/` holds app contexts such as `NavigationContext`.

### [content/](./content/)

TinaCMS content as JSON — the source of truth for site copy. See [Content Management](#content-management-tinacms).

### [tina/](./tina/)

TinaCMS configuration ([config.ts](./tina/config.ts)) and generated types.

### [components/](./components/)

The SDS component library and utilities, broken down into categories:

#### [components/compositions/](./components/compositions/)

Example arrangements of primitive components demonstrating responsive website patterns.

#### [components/hooks/](./components/hooks/)

Custom React hooks, including SSR-safe media query hooks using `useSyncExternalStore`.

#### [components/icons/](./components/icons/)

Icon components automatically generated by [scripts/icons](./scripts/icons).

#### [components/images/](./components/images/)

Placeholder images and image assets.

#### [components/layout/](./components/layout/)

Layout components crucial to the design system but without analogous Figma components.

#### [components/primitives/](./components/primitives/)

The main component library. These primitives cannot be reduced further into sub-components.

#### [components/utils/](./components/utils/)

Custom utilities and utility components.

### [lib/](./lib/)

Application logic, contexts, providers, and services:

- **contexts/** - React Context definitions
- **providers/** - React Provider components
- **hooks/** - Business logic hooks
- **services/** - API and data services
- **types/** - TypeScript type definitions

### [styles/](./styles/)

Global CSS including design tokens, reset styles, and responsive utilities.

### Code Connect and Storybook

All Code Connect docs and Storybook stories are defined in [src/figma](./src/figma) and [src/stories](./src/stories).

## Scripts

Some example integrations are available in `scripts` directory. They may require additional API scope that your org may or may not have access to. Where possible, there are some plugin examples to help fill gaps.

### [scripts/component-metadata](./scripts/component-metadata)

- Scripts to run in the JS Console in Figma
- Bulk manage descriptions for all components in the file. Instead of making a complicated plugin, you can do this more simply by running scripts directly from the JavaScript console.
- Copy the contents of [scripts/component-metadata/exportComponentJSON.js](./scripts/component-metadata/exportComponentJSON.js) and run in the console with the file open.
  - "Copy as object" the result and paste into [scripts/component-metadata/components.json](./scripts/component-metadata/components.json).
- There you can modify descriptions more easily.
- Once you have modified the descriptions, copy the JSON and paste at the top of [scripts/component-metadata/importComponentJSON.js](./scripts/component-metadata/importComponentJSON.js) as the value of the `json` variable.
- Copy all the contents of the import file and run in the console to batch update descriptions for the entire file.
- **This will only update the descriptions.** To update Dev Resources, you can use [scripts/dev-resources](#scriptsdev-resources).

### [scripts/dev-resources](./scripts/dev-resources)

- `npm run script:dev-resources` (REST API only)
- Sets dev resources for all components described in [scripts/dev-resources/devResources.mjs](./scripts/dev-resources/devResources.mjs) to match.
- Useful when swapping urls in bulk. Requires `Dev Resources: Write` scope on your REST API token.

### [scripts/icons](./scripts/icons)

- `npm run script:icons:rest`
- Gets all icons from the file, and generates components in the [components/icons](./components/icons) directory.
- Also generates [src/figma/icons/Icons.figma.tsx](./src/figma/icons/Icons.figma.tsx) for Code Connect.

### [scripts/tokens](./scripts/tokens)

- `npm run script:tokens:rest`
- Gets all variables and styles from Figma, and converts them to [styles/theme.css](./styles/theme.css).
- Creates [scripts/tokens/tokensCodeSyntaxes.js](./scripts/tokens/tokensCodeSyntaxes.js) which is a script you can run in the JS console in Figma to update all the variable's [codeSyntaxes](https://www.figma.com/plugin-docs/api/Variable/#codesyntax) with CSS that matches this repo.
- Includes some example plugins for how to get the same data without the Variables REST API.
  - [Install plugins](https://www.figma.com/plugin-docs/plugin-quickstart-guide/) in Development
  - Run plugins, and copy plugin outputs into [scripts/tokens/styles.json](./scripts/tokens/styles.json) and [scripts/tokens/tokens.json](./scripts/tokens/tokens.json)
  - Run `npm run script:tokens` (without `:rest`) and it will reference the JSON files directly without making a REST API request to update them

## Technology Stack

- **Next.js 16** - App Router with React Server Components
- **React 18** - With client and server component patterns
- **TinaCMS** - JSON-backed content management (`/admin`)
- **React Aria Components** - Accessible, production-ready UI primitives
- **Forminit** - Contact form submission
- **GSAP + Lenis** - Scroll-triggered animation and smooth scrolling
- **TypeScript** - Type-safe development
- **Storybook 10** - Component documentation and development
- **Figma Code Connect** - Design-to-code integration
- **CSS Variables** - Design token system
