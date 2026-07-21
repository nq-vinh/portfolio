---
title: This website
metaTitle: This website - a zero-JavaScript case study
summary: A static portfolio that makes performance, security, and accessibility measurable in the page itself.
tags:
  - Astro
  - TypeScript
  - CSS
date: 2026-07-21
featured: true
repo: https://github.com/nq-vinh/portfolio
stats:
  - value: 0 KB
    label: client JavaScript
  - value: 100 ×4
    label: Lighthouse categories
  - value: '0.000'
    label: cumulative layout shift
  - value: '1'
    label: request to paint
  - value: AA+
    label: WCAG in both themes
hooks:
  - id: zero-client-side-javascript
    misconception: A site with theme switching, page transitions, and responsive images is running a framework bundle.
    question: How much JavaScript is executing on this page right now?
    metric: 0 KB
    detail: No framework, no bundle, no hydration - two hash-pinned inline snippets for the theme, everything else is HTML and CSS.
  - id: zero-layout-shift
    misconception: Custom web fonts always cost a flash of fallback text or a visible reflow.
    question: Did anything on this page shift while it loaded?
    metric: 0.000 CLS
    detail: The fallback font is metric-matched to Inter, so the swap moves nothing - not even a line break.
  - id: one-request-to-first-paint
    misconception: Sites feel this fast because of a CDN, caching, and a service worker.
    question: How many requests did it take to paint this page?
    metric: One
    detail: Every byte of CSS ships inlined in the HTML, so there is no render-blocking stylesheet fetch.
---

## Zero client-side JavaScript

*Misconception: A site with theme switching, page transitions, and responsive images is running a framework bundle.*

The page has no hydrated Astro component and no external script.

The only executable client code is the pre-paint theme boot in `src/layouts/Base.astro` and the theme toggle in `src/components/ThemeSwitch.astro`.

The built document contains three non-JSON-LD inline blocks: the two executable theme blocks and one declarative `type="speculationrules"` block for moderate same-origin prefetching.

The speculation rules block is parsed as data by the browser, so it does not execute JavaScript or add a framework runtime.

The exact UTF-8 byte sizes of all three inline bodies are recorded here from the compressed build: the pre-paint boot is 195 bytes, the theme switch is 1267 bytes, and the speculation rules body is 89 bytes.

That is why the homepage can keep a theme toggle, responsive `Picture` output, and cross-document view transitions without hydration.

## Zero layout shift

*Misconception: Custom web fonts always cost a flash of fallback text or a visible reflow.*

`src/styles/global.css` defines an `Inter Fallback` face with the exact metric overrides used for the fallback path.

The source values are `ascent-override: 90%`, `descent-override: 22.43%`, `line-gap-override: 0%`, and `size-adjust: 107.4%`.

The font uses `font-display: swap`, while the portrait output declares 112 pixel dimensions and uses responsive AVIF and WebP sources.

The fallback and final font therefore occupy the same measurable space during the swap, including the line breaks in the introduction and case-study hooks.

The result is the `0.000 CLS` target recorded in the case-study stats rather than a claim based on visual feel.

## One request to first paint

*Misconception: Sites feel this fast because of a CDN, caching, and a service worker.*

The Astro build sets `build.inlineStylesheets` to `always` in `astro.config.mjs`.

Astro emits the page CSS inside the document, so the browser does not need a render-blocking stylesheet request before it can paint the layout.

The font preload and optimized portrait remain ordinary resource hints, but the critical path has no external CSS or JavaScript dependency.

The `prefetch` speculation rule starts only after a user shows intent by hovering a same-origin link, so it does not change the one-request-to-paint measurement.

## A CSP with nothing to allow

*Misconception: A static portfolio cannot enforce production-grade browser security without a backend.*

The root `staticwebapp.config.json` sends a restrictive Content Security Policy and keeps the static host responsible for the browser boundary.

The current directive is:

```text
default-src 'none'; connect-src 'self'; script-src 'sha256-FzYV65K3v7bE7vrjFw+hgSsUVHwNk4F9UUy+L3bPVnQ=' 'sha256-l6TIiISDUQaHYtCj8kZwEAsrve068cnMyzNucFrQOt8=' 'sha256-OGzK6U4An6xAiEgFeb7wUMf8VfUm6Cz8x3x5dDof3+k='; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

`default-src 'none'` denies unspecified resource classes, while `img-src 'self'` and `font-src 'self'` keep media and fonts on the site origin.

The two executable theme scripts are accepted only by their SHA-256 hashes, and JSON-LD plus speculation rules are handled as non-executable data blocks.

`scripts/verify-csp.mjs` walks every HTML file under `dist/`, skips scripts with a `src` attribute and `application/ld+json`, hashes every remaining body with SHA-256 and base64, and compares that required set with the declared `script-src` set.

The verifier prints missing and stale tokens and exits with status 1 when the sets differ, which turns an accidental inline-script change into a build failure.

It also checks this very page: the directive quoted above and the inline-script byte sizes are compared against the build, so the claims here cannot silently drift from production.

The same configuration also sends `Strict-Transport-Security` with one year, `includeSubDomains`, and `preload`.

## WCAG AA+ in both themes

*Misconception: Performance work is mostly about making a page faster, while accessibility is a separate layer added later.*

The layout owns one semantic `<main>` landmark, each page supplies one `h1`, and the skip link targets that main content directly.

The hook questions are real `h3` headings, the header and footer links use labeled navigation landmarks, and the active primary route exposes `aria-current="page"`.

Keyboard focus is visible through the global `:focus-visible` rule, and the theme control is a button with an `aria-pressed` state that follows the effective theme.

The stylesheet includes explicit `prefers-contrast: more`, `forced-colors: active`, and `prefers-reduced-motion` paths so the new cards, hooks, and stat strip retain borders, contrast, and usable navigation under those preferences.

Those concrete browser behaviors are why the case-study stat strip reports WCAG AA+ in both themes instead of treating accessibility as a post-launch audit.

## The build contract

Project metadata lives in the Astro content collection at `src/content.config.ts`, and each published Markdown entry supplies its own summary, tags, stats, and hook anchors.

The dynamic case-study route renders entries with `render(entry)` and throws during the build if a hook ID is missing from the rendered heading list.

That assertion keeps the homepage's explanatory links and the case-study's anchor IDs coupled at build time.

## The result

The implementation keeps the document as the primary product surface and uses browser primitives for the remaining polish.

Cross-document view transitions are enabled with `@view-transition`, while reduced-motion users receive the spec-sanctioned `navigation: none` switch.

The same source now powers the featured homepage card, the projects index, the case-study page, and the sitemap without duplicating project metadata.
