# AGENTS.md — DevRoast

## Project

Code-roasting web app. Users paste code, get brutally honest feedback with optional roast mode. Includes a shame leaderboard ranking the worst code.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** (`@theme inline` tokens in `src/app/globals.css`)
- **Shiki** (syntax highlighting, vesper theme)
- **Biome** (formatting + linting) — tabs, double quotes
- **pnpm**

## Structure

```
src/app/          → pages and page-level client components
src/components/ui → reusable UI components (see CLAUDE.md there for detailed patterns)
```

## Conventions

- **Named exports only** — `export function Foo`, never `export default`
- **Props** — interface named `{Component}Props`
- **Variants** — `Record<Variant, string>` outside the component body
- **Styling** — Tailwind-only, use theme tokens (`text-text-primary`, `bg-accent-green`), no hardcoded colors
- **Aesthetic** — dark terminal theme, no border-radius (except toggle knobs/dots)
- **Server components by default** — `"use client"` only when hooks or event handlers are needed
- **Barrel export** — add new UI components to `src/components/ui/index.ts`
- **Fonts** — `font-mono` (JetBrains Mono) for titles/labels/code, `font-body` (IBM Plex Mono) for descriptions/body text

## References

- UI component patterns: `src/components/ui/CLAUDE.md`
- Design tokens: `src/app/globals.css`
