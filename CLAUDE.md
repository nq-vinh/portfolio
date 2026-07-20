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

A single static portfolio page for Vinh Nguyen built with Astro, TypeScript, and plain CSS.
The site is its own case study, so its hard guarantees are the product - do not regress them with any change:

- **Zero client-side JavaScript** except two small inline scripts: the pre-paint theme boot in `src/layouts/Base.astro` and the theme switch logic in `src/components/ThemeSwitch.astro`.
  Never add framework islands, hydration, or external scripts.
- **No render-blocking requests beyond the document**: all CSS is inlined at build time (`build.inlineStylesheets: 'always'` in `astro.config.mjs`), the single Inter variable font is self-hosted in `public/fonts/`, subset to Latin, and preloaded.
  No third-party resources of any kind.
- **Lighthouse 100 across the board**, zero layout shift (metric-matched `Inter Fallback` font face), and WCAG AA+ contrast in both themes.
- **Accessibility**: semantic landmarks, single `h1` with strict heading order, skip link, visible focus styles, everything keyboard-operable.

## Architecture

- **Content lives in `src/data/*.ts`** (`profile`, `experience`, `projects`, `skills`), each exporting typed data via `as const satisfies <Interface>`.
  Editing site content means editing these files, not the markup.
- **`src/pages/index.astro`** is the whole site; it renders the data files inside `src/layouts/Base.astro`.
  `src/pages/404.astro` is the only other page.
- **`src/layouts/Base.astro`** owns the document shell: meta/OG tags, canonical URL, JSON-LD Person schema, font preload, and the inline pre-paint script that applies the stored theme to `document.documentElement.dataset.theme` before first render (prevents theme flash).
- **All styling is in one file, `src/styles/global.css`**, imported by the layout and fully inlined at build.
  Design tokens are CSS custom properties on `:root`; dark/light comes from `prefers-color-scheme` with `:root[data-theme='light' | 'dark']` overrides for the manual choice (persisted in `localStorage` under `theme`).
  The stylesheet also handles `prefers-reduced-motion`, `prefers-contrast: more`, `forced-colors`, and print - new UI must keep working under all of these.
  Layout is fluid from 320px to 4K via `clamp()`; no horizontal scroll at any viewport.
- **Deploy target is Azure Static Web Apps**: `staticwebapp.config.json` at the repo root configures the 404 rewrite, security headers, and immutable caching for hashed assets under `/_astro/`.
  The `dist/` output is host-agnostic static files.
- **The CSP in `staticwebapp.config.json` pins the two inline scripts by sha256 hash.**
  If either script in `Base.astro` or `ThemeSwitch.astro` changes, recompute the hashes from the built `dist/index.html` (sha256 of the exact inline text, base64) and update the `script-src` directive, or the theme scripts will be blocked in production.
  `npm run build` runs `scripts/verify-csp.mjs` after the Astro build; it fails the build and prints the correct hashes whenever the built inline scripts and the `script-src` directive drift apart.
  HSTS is set to one year with `preload` and the domain is submitted to the browser preload lists - never weaken or remove this header.
