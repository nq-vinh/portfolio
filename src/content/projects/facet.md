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
  src: ./facet/catalog.png
  alt: Facet's catalog view, a filter sidebar beside a grid of product cards with generated geometric artwork.
  caption: Ten thousand products behind eight facet groups, with every count live as you narrow. The filtering runs in a Web Worker over typed-array columns rather than an array of objects, so typing in the search box never competes with the render, and the product artwork is generated from each product's own attributes instead of fetched.
gallery:
  - src: ./facet/data-grid.png
    alt: The catalog in table view, a sortable data grid with thumbnail, name, brand, category, price, rating, and stock columns.
    caption: The same 10,000 rows as a real table rather than a div grid, so sorting, row semantics and aria-sort come from the platform. Rows are windowed inside a sized tbody and translated individually, which keeps native table semantics intact while only about 320 nodes exist at once.
  - src: ./facet/catalog-dark.png
    alt: The catalog view in dark theme, with the generated product artwork adapting to the darker surface.
    caption: One token layer drives both themes. The product artwork is generated rather than photographed, so it re-derives against the dark palette instead of sitting in a bright box.
  - src: ./facet/product-detail.png
    alt: A product detail page in dark theme, with a large generated hero image beside price, rating, colour and size options.
    caption: The card image and the detail hero share a view-transition-name, so navigation morphs one into the other. It is feature-detected and disabled entirely under prefers-reduced-motion.
stats:
  - value: 52 KB
    label: JavaScript, gzipped
  - value: '10,000'
    label: products, none fetched
  - value: '~320'
    label: DOM nodes for 10,000 rows
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
  - id: ten-thousand-rows-three-hundred-nodes
    misconception: Virtualised lists are a trade - you get the performance and you give up real table semantics and keyboard behaviour.
    question: How much DOM does it take to scroll ten thousand rows?
    metric: '~320 nodes'
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

## Ten thousand rows, three hundred nodes

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
