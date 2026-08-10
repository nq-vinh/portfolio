---
title: This website
metaTitle: This website - a zero-JavaScript case study
summary: A static portfolio that makes performance, security, and accessibility measurable in the page itself.
tags:
  - Astro
  - TypeScript
  - CSS
date: 2026-07-21
featured: false
repo: https://github.com/nq-vinh/portfolio
cover:
  src: ./this-website/resume-page.png
  alt: The resume page of this site, showing the experience timeline and skill groups in the site's own type and colour system.
scope:
  - The design token layer, both themes, and the print stylesheet that doubles as the resume PDF
  - A build step that pins every inline script by hash and fails when the CSP drifts
  - Build-time assertions coupling each case study's claims to its own prose
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

No hydrated component, no external script, no bundle.

The only executable client code is the pre-paint theme boot in `src/layouts/Base.astro` and the toggle in `src/components/ThemeSwitch.astro`. A third inline block is declarative `type="speculationrules"` JSON, parsed as data rather than run.

The exact UTF-8 byte sizes of all three inline bodies are recorded here from the compressed build: the pre-paint boot is 195 bytes, the theme switch is 1267 bytes, and the speculation rules body is 89 bytes.

Everything else - the theme toggle, responsive `Picture` output, cross-document view transitions - is HTML and CSS.

## Zero layout shift

*Misconception: Custom web fonts always cost a flash of fallback text or a visible reflow.*

`global.css` declares an `Inter Fallback` face metric-matched to Inter: `ascent-override: 90%`, `descent-override: 22.43%`, `line-gap-override: 0%`, `size-adjust: 107.4%`.

Fallback and final font occupy the same space during the swap, down to where the lines break, so the swap moves nothing and CLS stays at `0.000` rather than merely feeling stable.

## One request to first paint

*Misconception: Sites feel this fast because of a CDN, caching, and a service worker.*

`build.inlineStylesheets: 'always'` puts every byte of CSS inside the document, so there is no render-blocking stylesheet fetch before the browser can paint.

The font preload and the optimised portrait are ordinary hints. The prefetch speculation rule only fires once a visitor hovers a same-origin link, so it never contributes to the first-paint measurement.

## Enforced, not claimed

The interesting part is not the numbers. It is that the build refuses to ship when they stop being true.

The host sends a `default-src 'none'` policy where the only executable scripts are three SHA-256 hashes:

```text
default-src 'none'; connect-src 'self'; script-src 'sha256-FzYV65K3v7bE7vrjFw+hgSsUVHwNk4F9UUy+L3bPVnQ=' 'sha256-l6TIiISDUQaHYtCj8kZwEAsrve068cnMyzNucFrQOt8=' 'sha256-OGzK6U4An6xAiEgFeb7wUMf8VfUm6Cz8x3x5dDof3+k='; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'
```

*Hand-maintaining three hashes is a trap, so `scripts/verify-csp.mjs` walks every built HTML file, hashes each inline body, and fails the build when the set drifts from the directive. HSTS runs a year with `preload`, and the domain is on the browser preload lists.*

The same script checks this page against the build: the directive quoted above and the three byte counts are compared to what actually shipped, so the case study cannot silently diverge from the artefact it describes.

The content collection is held to the same standard. Every project's hook IDs must resolve to real heading anchors and every misconception string must appear verbatim in the prose, or the build throws - which is why the claims on a case study and the case study itself cannot drift apart.

## The result

Four Lighthouse categories at 100, zero layout shift, WCAG AA+ contrast in both themes, and a single semantic `main` landmark with a working skip link and visible focus throughout.

The stylesheet carries explicit `prefers-contrast: more`, `forced-colors: active`, `prefers-reduced-motion` and print paths, so the card grid, galleries and stat strip stay usable under all of them - and the print path is what turns the resume page into a clean PDF.
