# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Birdsey Group website is a Next.js 16 application built on Figma's Simple Design System (SDS), utilizing Code Connect for design-to-code integration. This is a real estate consulting firm's website with TinaCMS for content management.

## Development Commands

### Running the Application
- `npm run dev` - Start TinaCMS dev server with Next.js at localhost:8000 (recommended for development)
- `npm run app:dev` - Start Next.js dev server only at localhost:8000
- `npm run storybook` - Launch Storybook at localhost:6006
- `npm run build` - Build TinaCMS, Storybook, and Next.js application

### Build Commands
- `npm run app:build` - Build Next.js application
- `npm run storybook:build` - Build Storybook to public/storybook directory

### Linting
- `npm run app:lint` - Run ESLint

### Figma Integration Scripts
- `npm run script:tokens` or `npm run script:tokens:rest` - Sync design tokens from Figma
- `npm run script:icons` or `npm run script:icons:rest` - Sync icons from Figma
- `npm run script:dev-resources` - Update dev resources in Figma

## Architecture

### Content Management with TinaCMS

The site uses TinaCMS for content management with collections defined in [tina/config.ts](tina/config.ts):

- **Global Settings**: Navigation and footer configuration ([content/global/settings.json](content/global/settings.json))
- **Pages**: Page content organized into sections (hero, affiliates, performance, news, careers, contact)
- **Affiliates**: Company information for affiliated businesses
- **Team Members**: Staff profiles with references to affiliate companies

Content is stored as JSON files in the `content/` directory and accessed server-side in React Server Components.

### Application Structure

**Next.js 16 App Router**: The application uses Next.js 16 with App Router, mixing React Server Components (default) and Client Components (marked with `"use client"`).

**Key Directories**:

- `app/` - Next.js App Router pages, layouts, and page-specific components
  - `app/_components/` - Page-specific components (Header, Footer, HeroSection, etc.)
  - `app/_contexts/` - Application contexts (NavigationContext)
  - Each component directory contains: Component.tsx, index.ts, and component.module.css
- `components/` - SDS design system components (from original SDS)
  - `components/primitives/` - Base UI components (Button, Input, etc.)
  - `components/compositions/` - Complex composed components
  - `components/layout/` - Layout components (Flex, Section, Grid)
  - `components/hooks/` - UI-related hooks (useMediaQuery)
  - `components/icons/` - Auto-generated icon components
  - `components/utils/` - Utility components
- `lib/` - Data layer (contexts, providers, services, types, hooks)
- `styles/` - Global CSS including design tokens
- `src/` - SDS-specific files (stories, figma code connect files)
- `tina/` - TinaCMS configuration and generated types
- `content/` - TinaCMS content files (JSON)

### Import Aliases

TypeScript path aliases are configured in [tsconfig.json](tsconfig.json:24-51):

```tsx
import { AllProviders } from "@/lib";
import { Footer, Header } from "compositions";
import { useMediaQuery } from "hooks";
import { IconChevronLeft } from "icons";
import { Flex, Section } from "layout";
import { Button, Input, TextHeading } from "primitives";
import { clsx } from "utils";
```

- `@/*` - Root directory
- `data` - Maps to `./lib`
- `compositions`, `hooks`, `icons`, `images`, `layout`, `primitives`, `utils` - Map to respective `components/` subdirectories

### Content Loading Pattern

The homepage demonstrates the content loading pattern ([app/page.tsx](app/page.tsx:15-25)):

```tsx
// Read page content from TinaCMS JSON files
const contentPath = path.join(process.cwd(), "content/pages/home.json");
const contentFile = await fs.readFile(contentPath, "utf-8");
const content = JSON.parse(contentFile);

// Read global settings
const globalPath = path.join(process.cwd(), "content/global/settings.json");
const globalFile = await fs.readFile(globalPath, "utf-8");
const globalSettings = JSON.parse(globalFile);
```

Content is loaded server-side and passed as props to components. For new pages, follow this pattern.

## Simple Design System (SDS) Integration

This project is built on Figma's Simple Design System. Key principles:

### Design Tokens
All design tokens are defined as CSS variables in design system styles. Always use CSS variables instead of hardcoded values:

- Colors: `var(--sds-color-*)`
- Spacing: `var(--sds-size-space-*)` (e.g., `var(--sds-size-space-400)`)
- Typography: `var(--sds-typography-*)` or `var(--sds-font-*)`
- Border radius: `var(--sds-size-radius-*)`
- Shadows: `var(--sds-effects-shadows-*)`

### Component Usage
- Use existing SDS components from `components/` directory
- Layout components (Flex, Section, Grid) handle positioning - avoid custom layout CSS
- Check TypeScript definitions in component files for available props
- Reference [.cursor/rules/usage-guidelines.mdc](.cursor/rules/usage-guidelines.mdc) for detailed SDS component patterns

### Figma Code Connect
The project uses Figma Code Connect with document URL substitutions in [figma.config.json](figma.config.json). Component mappings are in `src/figma/` directory. When Figma designs are updated, run token and icon sync scripts to update code.

## Page Component Pattern

Page-specific components in `app/_components/` follow this structure:

```
ComponentName/
  ├── ComponentName.tsx       # Component implementation
  ├── componentName.module.css # CSS modules (scoped styles)
  └── index.ts                # Re-export for clean imports
```

Components use CSS modules for styling and follow these conventions:
- PascalCase for component names
- camelCase for CSS module filenames
- Semantic, BEM-inspired class names in CSS

## Important Technical Details

### React Server vs Client Components
- Most components are React Server Components by default (no interactivity)
- Use `"use client"` directive only when needed for:
  - Interactive features (onClick, onChange, etc.)
  - React hooks (useState, useEffect, useContext)
  - Browser APIs
  - Animation libraries (GSAP, Lenis)

### TinaCMS Admin
- Admin interface accessible at `/admin` route ([app/admin/page.tsx](app/admin/page.tsx))
- Requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` environment variables
- Content changes through TinaCMS UI update JSON files in `content/` directory

### Storybook Integration
- Storybook is accessible at `/storybook` in both dev and production
- In development: proxies to localhost:6006
- In production: serves static build from `public/storybook/`
- Stories are in `src/stories/` directory

### Environment Variables
Required environment variables (see [.env.example](.env.example)):
- `NEXT_PUBLIC_TINA_CLIENT_ID` - TinaCMS client ID
- `TINA_TOKEN` - TinaCMS token
- `FIGMA_ACCESS_TOKEN` - For Figma API integration
- `FIGMA_FILE_KEY` - Figma file identifier
- `TINA_PUBLIC_IS_LOCAL` - Set to "true" for local TinaCMS development

## Styling Guidelines

1. Use CSS modules for component-specific styles
2. Use SDS design tokens (CSS variables) for all design values
3. Use SDS layout components (Flex, Section) instead of custom layout CSS
4. Avoid hardcoding colors, spacing, or typography values
5. Mobile-first responsive design using media queries from `useMediaQuery` hook

## Figma MCP Integration

When implementing designs from Figma:
1. Use Figma MCP tools to extract design data
2. Map Figma components to existing SDS components
3. Check component TypeScript definitions for available props
4. Apply design tokens for styling values
5. Read annotations carefully for interaction and content notes

## Common Patterns

### Section Components
Page sections typically follow this structure:
```tsx
export function SectionName({ title, ...props }: SectionNameProps) {
  return (
    <section className={styles.sectionName}>
      <div className={styles.container}>
        {/* Section content */}
      </div>
    </section>
  );
}
```

### Responsive Design
Use the `useMediaQuery` hook for responsive behavior:
```tsx
"use client";
import { useMediaQuery } from "hooks";

export function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  // Adjust component based on breakpoints
}
```

### Animation
GSAP and Lenis are available for animations. See [app/_components/AnimatedWord/AnimatedWord.tsx](app/_components/AnimatedWord/AnimatedWord.tsx) for an example of scroll-triggered animations.
