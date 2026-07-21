# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node 22.12+.

```sh
npm run dev        # dev server at localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the production build
```

There is no lint or test tooling configured.
Verification is done by building and inspecting the output (Lighthouse, axe).

## What this is

A static portfolio for Vinh Nguyen built with Astro, TypeScript, and plain CSS: a project-led landing page, case-study pages under `/projects/`, a `/resume` page, and a 404.
The site is its own case study, so its hard guarantees are the product - do not regress them with any change:

- **Zero client-side JavaScript** except two small inline scripts: the pre-paint theme boot in `src/layouts/Base.astro` and the theme switch logic in `src/components/ThemeSwitch.astro`.
  A third inline block in `Base.astro` is declarative Speculation Rules JSON (`type="speculationrules"`, never executed) that prefetches same-origin pages on hover.
  Never add framework islands, hydration, or external scripts.
- **Seamless navigation stays JS-free**: cross-document View Transitions come from the CSS `@view-transition` rule in `global.css` (with a `prefers-reduced-motion` kill switch); the featured project title and case-study `h1` share slug-derived `view-transition-name`s.
- **No render-blocking requests beyond the document**: all CSS is inlined at build time (`build.inlineStylesheets: 'always'` in `astro.config.mjs`), the single Inter variable font is self-hosted in `public/fonts/`, subset to Latin, and preloaded.
  No third-party resources of any kind.
- **Lighthouse 100 across the board**, zero layout shift (metric-matched `Inter Fallback` font face), and WCAG AA+ contrast in both themes.
- **Accessibility**: semantic landmarks, single `h1` with strict heading order, skip link, visible focus styles, everything keyboard-operable.

## Architecture

- **Profile, experience, and skills live in `src/data/*.ts`**, each exporting typed data via `as const satisfies <Interface>`.
  **Projects live in the content collection `src/content/projects/*.md`** with a zod schema in `src/content.config.ts`; frontmatter carries the card metadata, stats, and the hook triples (misconception/question/metric/detail) the homepage teases, and the markdown body is the case study.
  Hook `id`s must match a heading slug in the body, and each hook's misconception text must appear verbatim in the body - `src/pages/projects/[slug].astro` asserts both at build time.
  All pages read the collection through `getPublishedProjects()` in `src/lib/projects.ts` (draft filter + newest-first sort).
  Editing site content means editing these files, not the markup.
- **Pages**: `src/pages/index.astro` (hero, featured case-study showcase, Now, Contact), `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro` (case studies), `src/pages/resume.astro` (timeline + skills; the print stylesheet makes it the printable resume), `src/pages/404.astro`, and the hand-rolled `src/pages/sitemap.xml.ts`.
  `trailingSlash: 'always'` is set - author internal links with trailing slashes.
- **`src/layouts/Base.astro`** owns the document shell: meta/OG tags, canonical URL, JSON-LD Person schema, font preload, and the inline pre-paint script that applies the stored theme to `document.documentElement.dataset.theme` before first render (prevents theme flash).
- **All styling is in one file, `src/styles/global.css`**, imported by the layout and fully inlined at build.
  Design tokens are CSS custom properties on `:root`; dark/light comes from `prefers-color-scheme` with `:root[data-theme='light' | 'dark']` overrides for the manual choice (persisted in `localStorage` under `theme`).
  The stylesheet also handles `prefers-reduced-motion`, `prefers-contrast: more`, `forced-colors`, and print - new UI must keep working under all of these.
  Layout is fluid from 320px to 4K via `clamp()`; no horizontal scroll at any viewport.
- **Deploy target is Azure Static Web Apps**: `staticwebapp.config.json` at the repo root configures the 404 rewrite, security headers, and immutable caching for hashed assets under `/_astro/`.
  The `dist/` output is host-agnostic static files.
- **The CSP in `staticwebapp.config.json` pins the three inline scripts by sha256 hash** (theme boot, theme switch, and the Speculation Rules block).
  If any of them changes, recompute the hashes from the built `dist/index.html` (sha256 of the exact inline text, base64) and update the `script-src` directive, or they will be blocked in production.
  `npm run build` runs `scripts/verify-csp.mjs` after the Astro build; it fails the build and prints the correct hashes whenever the built inline scripts and the `script-src` directive drift apart.
  The same script also verifies the case-study prose: any fenced code block in `src/content/projects/*.md` containing `script-src` must equal the configured CSP exactly, and any `N bytes` claim in such a file must match an actual inline-script body size in `dist/`.
  HSTS is set to one year with `preload` and the domain is submitted to the browser preload lists - never weaken or remove this header.
