# Getting Started with SDS (Simple Design System)

This guide explains how the VisualBoston team can use this design system as a foundation for new projects.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Using SDS in a New Project](#using-sds-in-a-new-project)
- [Development Workflow](#development-workflow)
- [Customization Guide](#customization-guide)
- [Deployment](#deployment)

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Figma access token (for design token sync)

### Local Development

```bash
# Clone the repository
git clone https://github.com/visualboston/sds.git
cd sds

# Install dependencies
npm install

# Start development servers
npm run app:dev        # Next.js on http://localhost:8000
npm run storybook      # Storybook on http://localhost:6006
```

---

## Project Structure

```
sds/
├── app/                          # Next.js app directory
│   └── page.tsx                  # Homepage example
├── components/
│   ├── compositions/             # Complex, composed components
│   │   ├── Cards/               # Card variants (Testimonial, Pricing, etc.)
│   │   ├── Forms/               # Form compositions
│   │   ├── Headers/             # Header variants
│   │   ├── Footers/             # Footer variants
│   │   └── Sections/            # Section layouts (Hero, etc.)
│   ├── primitives/              # Core UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   └── ...                  # All primitive components
│   ├── layout/                  # Layout components
│   │   ├── Flex/
│   │   ├── Grid/
│   │   └── Section/
│   ├── hooks/                   # Custom React hooks
│   ├── icons/                   # Icon components (auto-generated)
│   ├── images/                  # Image assets
│   └── utils/                   # Utility components and functions
├── lib/
│   └── providers/               # React context providers
├── scripts/
│   ├── dev-resources/           # Figma asset fetcher
│   ├── icons/                   # Figma icon sync
│   └── tokens/                  # Figma design token sync
├── src/stories/                 # Storybook stories
│   ├── primitives/
│   ├── compositions/
│   ├── layout/
│   └── hooks/
├── styles/
│   └── globals.css              # Global styles and CSS variables
├── .env                         # Environment variables (Figma tokens)
├── figma.config.json            # Figma Code Connect configuration
├── next.config.js               # Next.js configuration
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

---

## Using SDS in a New Project

### Option 1: Fork This Repository (Recommended)

Best for starting a new project that will maintain its own design system.

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/your-project-name.git
cd your-project-name

# 3. Remove existing git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit from SDS template"

# 4. Update package.json
# Change "name" to your project name
# Update version, description, etc.

# 5. Install dependencies
npm install

# 6. Set up environment variables
cp .env-rename .env
# Add your Figma tokens

# 7. Connect to your new repository
git remote add origin https://github.com/YOUR_USERNAME/your-project-name.git
git branch -M main
git push -u origin main

# 8. Start development
npm run app:dev
npm run storybook
```

### Option 2: Use as an npm Package (Future)

When published as a package, you can import components directly:

```bash
npm install @visualboston/sds
```

```tsx
import { Button, Card, Hero } from '@visualboston/sds';
import '@visualboston/sds/styles';
```

### Option 3: Copy Components Selectively

For projects that only need specific components:

```bash
# 1. Create your Next.js project
npx create-next-app@latest my-project

# 2. Copy specific components
cp -r sds/components/primitives/Button my-project/components/primitives/
cp -r sds/components/layout my-project/components/

# 3. Copy necessary dependencies from package.json
# - react-aria-components
# - clsx

# 4. Copy global styles
cp sds/styles/globals.css my-project/styles/
```

---

## Development Workflow

### 1. Component Development

```bash
# Start Storybook for component development
npm run storybook

# Create a new component
mkdir components/primitives/MyComponent
touch components/primitives/MyComponent/MyComponent.tsx
touch components/primitives/MyComponent/myComponent.css

# Create a story
touch src/stories/primitives/MyComponent.stories.tsx
```

### 2. Design Token Sync

Update design tokens from Figma:

```bash
# Sync color tokens, typography, spacing, etc.
npm run script:tokens

# Sync icons from Figma
npm run script:icons

# Fetch design resources (images, etc.)
npm run script:dev-resources
```

### 3. Testing in Next.js App

```bash
# Start the Next.js development server
npm run app:dev

# View at http://localhost:8000
```

### 4. View Storybook

```bash
# Development
npm run storybook
# View at http://localhost:6006

# Or via Next.js proxy
# http://localhost:8000/storybook
```

---

## Customization Guide

### Updating Colors and Design Tokens

1. **Modify in Figma** (Recommended)
   - Update your Figma design tokens
   - Run `npm run script:tokens` to sync

2. **Modify CSS Variables Directly**
   - Edit `styles/globals.css`
   - Update CSS custom properties:

```css
:root {
  /* Update these values */
  --sds-color-primary: #your-color;
  --sds-spacing-100: 4px;
  /* etc. */
}
```

### Adding Custom Components

```tsx
// components/primitives/MyButton/MyButton.tsx
'use client';

import { clsx } from 'clsx';
import { Button as RACButton } from 'react-aria-components';
import './myButton.css';

export type MyButtonProps = {
  variant?: 'custom' | 'special';
  children: React.ReactNode;
};

export function MyButton({ variant = 'custom', children }: MyButtonProps) {
  return (
    <RACButton className={clsx('my-button', `my-button-${variant}`)}>
      {children}
    </RACButton>
  );
}
```

### Customizing Existing Components

1. **Copy the component** to your project
2. **Rename it** to avoid conflicts
3. **Modify** as needed
4. **Export** from your own index file

---

## Key Scripts

```json
{
  "app:dev": "Start Next.js dev server (port 8000)",
  "app:build": "Build Next.js for production",
  "app:start": "Start production server",
  "storybook": "Start Storybook dev server (port 6006)",
  "storybook:build": "Build static Storybook",
  "build": "Build both Storybook and Next.js",
  "script:tokens": "Sync design tokens from Figma",
  "script:icons": "Sync icons from Figma",
  "script:dev-resources": "Fetch design resources from Figma"
}
```

---

## Environment Variables

Create a `.env` file in the root:

```bash
# Figma API Configuration
FIGMA_ACCESS_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_figma_file_key_here
```

### Getting Figma Credentials

1. **Access Token**:
   - Go to Figma → Settings → Account → Personal Access Tokens
   - Generate a new token with file read permissions

2. **File Key**:
   - Open your Figma file
   - Copy from URL: `https://figma.com/design/{FILE_KEY}/...`

---

## Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project in Vercel dashboard
   - Connect to your Git repository

2. **Configure Build**
   ```
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   - Add `FIGMA_ACCESS_TOKEN`
   - Add `FIGMA_FILE_KEY`

4. **Deploy**
   - Vercel automatically builds on push to main
   - Storybook available at `/storybook`

### Build Commands

```bash
# Production build
npm run build

# This runs:
# 1. npm run storybook:build  (builds to public/storybook)
# 2. npm run app:build        (builds Next.js)

# Start production server
npm run app:start
```

---

## Component Architecture

### Primitives

Low-level, single-purpose components:
- Built on React Aria Components
- Minimal styling
- Maximum flexibility
- Examples: Button, Input, Avatar

### Compositions

Higher-level components composed from primitives:
- Business-specific patterns
- Pre-styled combinations
- Examples: TestimonialCard, Hero, Header

### Layout

Components for page structure:
- Flex, Grid, Section
- Responsive containers
- Spacing utilities

---

## Design System Principles

### 1. **Component Composition**
Build complex UIs from simple primitives:

```tsx
<Hero>
  <TextContentTitle title="Welcome" subtitle="Get started" />
  <ButtonGroup>
    <Button variant="neutral">Learn More</Button>
    <Button variant="primary">Sign Up</Button>
  </ButtonGroup>
</Hero>
```

### 2. **Variant-Based Styling**
Use variants instead of custom CSS:

```tsx
<Button variant="primary" size="medium">
  Click me
</Button>
```

### 3. **CSS Custom Properties**
All design tokens use CSS variables:

```css
.my-component {
  color: var(--sds-color-primary);
  padding: var(--sds-spacing-400);
}
```

### 4. **Type Safety**
Leverage TypeScript for component props:

```tsx
type ButtonProps = {
  variant: 'primary' | 'neutral' | 'subtle';
  size: 'small' | 'medium';
};
```

---

## Integration with Figma

### Code Connect

This project uses Figma Code Connect to link Figma components to code:

```bash
# Publish Code Connect mappings
npx figma connect publish
```

### Import Paths Configuration

The `figma.config.json` defines path mappings:

```json
{
  "importPaths": {
    "components/primitives/**/*": "primitives",
    "components/layout/**/*": "layout"
  }
}
```

---

## Best Practices

### 1. **Use Existing Components First**
Before creating new components, check:
- `components/primitives/` for basic UI
- `components/compositions/` for patterns
- Storybook for examples

### 2. **Follow Naming Conventions**
- Components: PascalCase (`Button`, `TestimonialCard`)
- Files: Match component name (`Button.tsx`, `button.css`)
- CSS classes: kebab-case (`button-variant-primary`)

### 3. **Co-locate Styles**
Keep CSS with components:
```
Button/
├── Button.tsx
└── button.css
```

### 4. **Export from Index Files**
```tsx
// components/primitives/index.ts
export * from './Button/Button';
export * from './Input/Input';
```

### 5. **Write Stories**
Every component should have Storybook stories:
```tsx
// src/stories/primitives/Button.stories.tsx
export const Primary: Story = {
  args: { variant: 'primary', children: 'Click me' }
};
```

---

## Troubleshooting

### Storybook Not Loading Assets

If `/storybook` returns 404s for JS/CSS:
- Check `public/storybook` exists after build
- Verify `next.config.js` rewrites are configured
- Check `.storybook/main.tsx` has correct `managerHead`

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Design Token Sync Fails

- Verify `FIGMA_ACCESS_TOKEN` is valid
- Check `FIGMA_FILE_KEY` matches your file
- Ensure Figma API access is enabled

---

## Resources

- **Documentation**: [Next.js Docs](https://nextjs.org/docs)
- **Component Library**: [React Aria Components](https://react-spectrum.adobe.com/react-aria/components.html)
- **Storybook**: [http://localhost:6006](http://localhost:6006)
- **Design File**: Check `FIGMA_FILE_KEY` in `.env`

---

## Support

For VisualBoston team questions:
1. Check this documentation first
2. Review existing components in Storybook
3. Check the component source code
4. Ask in team Slack channel

---

## License

Internal VisualBoston project. All rights reserved.
