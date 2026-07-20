# Vinh's Portfolio

Personal portfolio, live at [nqvinh.tech](https://nqvinh.tech).
A static site built with [Astro](https://astro.build), TypeScript, and plain CSS: one page plus a custom 404.

All content lives in typed data files under `src/data/` (`profile`, `experience`, `projects`, `skills`).
Editing the site means editing those files, not the markup.

## Guarantees

- **Zero client-side JavaScript by default.**
  The only scripts are two small inline ones: a pre-paint boot in the document head that applies the stored theme before first render (so there is no theme flash), and the theme toggle logic itself.
- **No render-blocking requests beyond the document.**
  All CSS is inlined at build time (`build.inlineStylesheets: 'always'`), the HTML is minified (`compressHTML`), the one webfont (Inter) is self-hosted, subset, and preloaded, and there are no third-party resources.
- **Performance:** Lighthouse 100/100/100/100, LCP around 1.1s on throttled 4G, zero cumulative layout shift.
  The portrait is optimized at build time by `astro:assets` into responsive AVIF/WebP sources with explicit dimensions.
- **Accessibility:** semantic landmarks, a single `h1` with strict heading order, a skip link, visible focus styles, keyboard-operable everything, and WCAG AA+ contrast in both themes.
  Verified with axe.
- **Theming:** automatic light/dark via `prefers-color-scheme` plus an accessible toggle button (`aria-pressed`).
  A choice that differs from the OS preference is persisted in `localStorage`; toggling back to match the OS clears the override so the site follows the system again.
  The active theme is reflected through the `color-scheme` property.
- **SEO:** canonical URL, Open Graph and Twitter card tags with a 1200x630 `og:image`, and a JSON-LD `Person` schema with `sameAs` profile links in the document head.
- **Media preferences honored:** `forced-colors` (Windows High Contrast), `prefers-contrast: more`, and `prefers-reduced-motion` are all handled; there is also a print stylesheet.
- **Responsive from 320px to 4K** with fluid type and spacing via `clamp()`, no horizontal scroll at any viewport.

Typography is [Inter](https://rsms.me/inter/) (variable, weights 100-900), self-hosted as a single Latin-subset woff2 in `public/fonts/` and preloaded, with `font-display: swap` and a metric-matched `Inter Fallback` face so there is no layout shift while the font loads.
The font is licensed under the SIL Open Font License (see `public/fonts/inter-LICENSE.txt`).

## Develop

Requires Node 22.12+.

```sh
npm install
npm run dev        # dev server at localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the production build
```

## Deploy

The build output in `dist/` is plain static files and runs on any static host (Azure Static Web Apps, Cloudflare Pages, Netlify, GitHub Pages, nginx, ...).

### Azure Static Web Apps (primary)

`staticwebapp.config.json` at the repo root configures the custom 404 rewrite, security headers (`X-Content-Type-Options`, `Referrer-Policy`), and immutable caching for hashed assets under `/_astro/` and the font under `/fonts/`.

Pushes to `main` build and deploy automatically through the Azure-generated GitHub Actions workflow in `.github/workflows/` (`app_location: /`, `output_location: dist`, no API).

For a one-off manual deploy, use the [SWA CLI](https://azure.github.io/static-web-apps-cli/):

```sh
npm run build
npx @azure/static-web-apps-cli deploy ./dist --env production
```

### Any other static host

Serve `dist/` as the web root and map 404s to `/404.html`.
Long-cache `/_astro/*` (contents are hash-named) and `/fonts/*`; serve HTML with `must-revalidate` and reproduce the security headers from `staticwebapp.config.json`.
