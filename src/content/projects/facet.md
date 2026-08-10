---
title: Facet
metaTitle: Facet - a 10,000-product storefront in 52 KB of JavaScript
summary: A faceted catalog of 10,000 products that ships no product data, makes no network request, and runs Vue with the virtual DOM compiled out of the bundle.
tags:
  - Vue
  - TypeScript
  - Web Workers
  - CSS
date: 2026-07-28
featured: true
repo: https://github.com/nq-vinh/facet
live: https://facet.nqvinh.tech
cover:
  src: ./facet/catalog-filtered.png
  alt: Facet's catalog filtered to Seating, with live counts in the filter sidebar beside a grid of product cards with generated artwork.
  caption: One checked facet narrows 10,000 products to 1,219, and every remaining count in the sidebar has already been recomputed off the main thread.
gallery:
  - src: ./facet/table-sorted.png
    alt: The catalog as a table sorted by price, mid-scroll through thousands of rows, with thumbnail, name, brand, category, price, rating and stock columns.
    caption: Row five thousand of a real table sorted by price - 23 rows exist in the DOM, and aria-rowcount still describes all 10,000.
  - src: ./facet/search-hud.png
    alt: The catalog searched for "oak", with the performance HUD in the corner reporting interaction latency, long tasks and DOM node count.
    caption: Typing "oak" refilters all 10,000 products, and the built-in HUD shows the receipt - a 24 ms interaction and zero long tasks.
  - src: ./facet/product-detail-dark.png
    alt: A product detail page in dark theme, with a large generated hero image beside price, stock badge, colour and size options.
    caption: Every product image, this hero included, is drawn at runtime from the product's own attributes, so the storefront ships no image files.
stats:
  - value: 52 KB
    label: JavaScript, gzipped
  - value: '10,000'
    label: products, none fetched
  - value: '23'
    label: DOM rows while scrolling 10,000
  - value: '0'
    label: virtual DOM in the bundle
  - value: '2'
    label: runtime dependencies
hooks:
  - id: ten-thousand-products-zero-requests
    misconception: A catalog of ten thousand products needs an API behind it, or at least a JSON file to download.
    question: How many bytes of product data does this ship?
    metric: 0 bytes
    detail: Every name, brand, price, rating, colour, size and product image is derived on demand from a seeded generator, so the catalog is byte-identical on every load and the tests have something honest to assert against.
  - id: no-virtual-dom-in-the-bundle
    misconception: Choosing a framework means shipping its runtime, and shipping a framework runtime means shipping a virtual DOM.
    question: How much virtual DOM is in this bundle?
    metric: '0'
    detail: Every component compiles through Vue's Vapor mode, and a build step greps the unminified output for virtual-DOM markers so the claim fails the build rather than quietly rotting.
  - id: ten-thousand-rows-twenty-three-in-the-dom
    misconception: Virtualised lists are a trade - you get the performance and you give up real table semantics and keyboard behaviour.
    question: How many rows does it take to scroll ten thousand?
    metric: '23'
    detail: The table is a real grid with aria-rowcount over the full virtual set, roving focus that survives row recycling, and Home, End, PageUp and PageDown all landing where a keyboard user would expect.
---

## Ten thousand products, zero requests

*Misconception: A catalog of ten thousand products needs an API behind it, or at least a JSON file to download.*

Facet has no backend and makes no network request after the document and its assets load.

Every product is a pure function of its index: `product(4213)` derives the same name, brand, category, price, colour set, size set, rating, stock level and creation date on every machine, forever.

The generator is a `mulberry32` PRNG seeded through a splitmix-style avalanche from one constant, and ESLint bans `Math.random` outright so nothing can quietly leak non-determinism into the catalog.

The product photography is generated too.

Rather than ship ten thousand images or fall back to grey placeholder boxes, `domain/image.ts` composes each one from layered geometric shapes drawn from the same seed, which is why the catalog looks populated rather than skeletal at zero transfer cost.

Determinism is what makes the rest of the project testable: screenshots do not drift, end-to-end tests can navigate to a product that is guaranteed to exist, and a failing assertion means a real regression rather than a reshuffled fixture.

## No virtual DOM in the bundle

*Misconception: Choosing a framework means shipping its runtime, and shipping a framework runtime means shipping a virtual DOM.*

Every component in Facet is authored as `<script setup vapor>` and the app boots through `createVaporApp`, so Vue compiles components into direct DOM operations instead of render functions that diff a tree.

Getting there was not free.

Vue Router's stock `RouterView` and `RouterLink` do not render inside a pure Vapor tree, which surfaced as an empty main landmark rather than an error, so the router integration is a small set of local components over the router's own matching and history.

A Vite transform then strips the router's component registrations, and it throws at build time if the router's source shape changes rather than silently letting the virtual-DOM runtime back in.

The claim is enforced rather than asserted.

`scripts/verify-bundle.mjs` measures the shipped bundle, then runs a second unminified build purely to read, because minified output tells you nothing about which runtime is inside it.

```js
const foundVdomMarkers = vdomMarkers.filter((marker) => auditSource.includes(marker))
const foundVaporMarkers = vaporMarkers.filter((marker) => auditSource.includes(marker))

if (foundVdomMarkers.length > 0) {
  throw new Error(`VDOM runtime markers found: ${foundVdomMarkers.join(', ')}`)
}

if (foundVaporMarkers.length === 0) {
  throw new Error(`No Vapor runtime markers found. Checked: ${vaporMarkers.join(', ')}`)
}

if (totalGzipBytes > gzipBudgetBytes) {
  throw new Error(`JavaScript exceeds the ${gzipBudgetBytes} byte gzip budget.`)
}
```

*Absence is the hard half. Checking that the Vapor markers are present too means the audit fails loudly if a future Vue release renames them, rather than passing because it found nothing either way.*

## Ten thousand rows, twenty-three in the DOM

*Misconception: Virtualised lists are a trade - you get the performance and you give up real table semantics and keyboard behaviour.*

Both the card grid and the table window their content against the document scroller, measuring in a rAF-batched pass so scrolling never reads layout in the middle of a frame.

The table was the harder half.

Windowing a table usually means abandoning `<table>` for absolutely positioned divs, which costs every row and cell semantic the platform gives you for free, so instead the rows are translated individually inside a `tbody` sized to the full virtual height.

The result keeps `role="grid"` with `aria-rowcount` and `aria-rowindex` describing all ten thousand rows rather than the few dozen actually present, `aria-sort` on the sortable headers, and a roving tabindex that survives row recycling.

Arrow keys, Home, End, PageUp, PageDown and Ctrl+Home all move focus to the cell a keyboard user expects, including when the target row does not exist in the DOM yet and has to be scrolled into existence first.

Layout shift is zero, because every window has a known height before it renders.

## Faceting in a worker

Filtering ten thousand products across eight facet groups on the main thread would drop frames during typing, so the work happens in a Web Worker over typed-array columns rather than an array of objects.

Colours and sizes are bitmask sets, prices and ratings are numeric columns, and the worker returns both the matching id list and the facet counts.

Those counts are disjunctive: the number beside "Lighting" is computed with every other group's filters applied but not the category filter itself, which is what makes the counts useful rather than misleading as you narrow a search.

## Verified end to end

The bundle budget, the absence of the virtual DOM, and the presence of Vapor are all build-time checks rather than claims in a readme.

Twenty-two unit tests cover the generator, the worker's filtering and counting, and the windowing maths.

Thirteen Playwright specs cover the catalog-to-cart journey using keyboard input only, deep-linked filter state surviving reload and history navigation, determinism across fresh loads, DOM-node and layout budgets while scrolling, and grid accessibility through row recycling.

An axe pass runs over every page in both colour schemes and reports no violations.

## The result

Two runtime dependencies, 52 KB of gzipped JavaScript, and 100 across all four Lighthouse categories on all three pages with zero cumulative layout shift and no total blocking time.

The parts I would keep are not the numbers, though.

They are the decisions that made the numbers hold: a determinism rule strict enough that a lint error catches its violation, a bundle claim that fails the build when it stops being true, and a virtualised table that gave up none of the semantics it was supposed to trade away.
