---
title: Daybook
metaTitle: Daybook - a 100,000-row React ledger that re-renders one row per payment
summary: A business-banking dashboard in React with a 100,000-row ledger, no backend, and a live payment feed that re-renders only the row each payment settles.
tags:
  - React
  - TypeScript
  - Web Workers
  - Canvas
date: 2026-10-17
featured: true
repo: https://github.com/nq-vinh/daybook
live: https://daybook.nqvinh.tech
cover:
  src: ./daybook/overview-live-feed.png
  alt: Daybook's overview in light theme, with balance tiles for three accounts above a cash-flow bar chart and an incoming payments card listing three booked payments.
  caption: Twelve months of net cash flow, the month to date and three hatched forecast months share one canvas, while payments from the seeded live feed settle in the card beside it.
gallery:
  - src: ./daybook/ledger-dark.png
    alt: The transactions ledger in dark theme, with category and card filters in a sidebar, totals for transactions, debits, credits and net, and rows with date, counterparty, category, status and amount columns.
    caption: The unfiltered ledger counts all 100,000 transactions and totals their debits, credits and net, computed in a worker that answers with ids only.
  - src: ./daybook/cards-frozen.png
    alt: The cards page in light theme, listing team cards per account with monthly spend meters, Near limit, Over limit and Frozen badges, and a Frozen switch on each row.
    caption: Spend meters flag Near limit from 80 % of the monthly limit and Over limit at or past it, and a frozen card carries a Frozen badge beside its switch, so no state relies on colour alone.
  - src: ./daybook/design-contrast-dark.png
    alt: The design system page in dark theme, with the colour section's contrast pairs table listing foreground and background tokens, measured ratios and the WCAG level each reaches.
    caption: Each ratio is measured in the visitor's browser for the active theme, here dark, and cut rather than rounded to two decimals, so a shown value never flatters the measurement.
stats:
  - value: 86 KB
    label: initial JavaScript, gzipped
  - value: '100,000'
    label: transactions, none fetched
  - value: '35'
    label: DOM rows while scrolling 100,000
  - value: '1'
    label: row re-rendered per feed event
  - value: '30'
    label: contrast pairs measured at runtime
hooks:
  - id: one-row-per-payment
    misconception: A React dashboard this busy is re-rendering constantly.
    question: How many components re-render when a payment lands?
    metric: 1 row
    detail: Each ledger row subscribes to its own key in the feed store through useSyncExternalStore, and a Profiler test asserts one row commit and one ledger commit per payment in the default view, and zero rows when the payment is outside the visible window.
  - id: a-hundred-thousand-rows-thirty-five-in-the-dom
    misconception: A 100,000-row ledger needs a backend and pagination.
    question: How many rows are in the DOM right now?
    metric: '35'
    detail: A worker answers every filter, search and sort with ids only, as an Int32Array whose buffer is transferred, and the main thread derives each visible row from transaction(id), so there is no page-window protocol and aria-rowcount still reports the full set.
  - id: popovers-without-a-positioning-library
    misconception: Menus and tooltips need a positioning library.
    question: How much JavaScript positions these popovers?
    metric: None
    detail: Menu and Tooltip use the Popover API and CSS anchor positioning, and the chart tooltip anchors to a box script positions over the active bar, so script places the anchor and CSS decides where the panel goes.
  - id: undo-after-commit
    misconception: Optimistic UI is a trade against correctness.
    question: How many seeded edit-and-undo sequences check the stores against a replay?
    metric: '150'
    detail: A property test runs 150 seeded sequences of 40 steps, undoing pending and committed edits in any order, and after every step the stored edits and the merged optimistic view both match a replayed model.
---

## One row per payment

*Misconception: A React dashboard this busy is re-rendering constantly.*

Daybook is a business-banking dashboard for a fictional small company: three accounts, a ledger of 100,000 transactions, a cash-flow chart with a forecast, budgets, team cards and a live feed of incoming and outgoing payments.

There is no backend: the app is static files, the data is generated in the browser and in a worker, and the only runtime dependencies are `react` and `react-dom`.

The live feed is the stress test: a seeded schedule of 60 payments arrives while you work, and each one settles a transaction that is already in the ledger rather than inserting a new one.

An insertion at the top would shift every index below it and re-render the whole window, while a settlement changes one row key, which is what makes "one row per payment" measurable at all.

Each table row subscribes to its own key in the feed store through `useSyncExternalStore`, so a settlement notifies the one row whose status changed, and the totals re-query the worker without touching the rows.

In the default view that is one row; with the running-balance column shown, a declined payment also re-renders the rows whose balance it changes, and the test asserts that count exactly.

When the worker answers with the same ids and new totals, the query hook keeps the previous ids reference, so the table never sees a new prop.

The claim is a test rather than a profiler screenshot: `src/pages/transactions.test.tsx` wraps every row and the ledger in a `<Profiler>` and counts commits.

```tsx
act(() => {
  deliverForTest(settled)
})

expect(profile.rows).toBe(1)
expect(profile.commits.ledger).toBe(1)
expect(profile.commits.sidebar).toBe(0)
```

*A payment outside the visible window commits zero rows and zero ledger renders, and still updates the totals.*

Manual memoisation is banned by ESLint and the React Compiler does it instead; an unminified build shows the app shell compiled with an 11-slot memo cache.

The compiler still needed measuring: passing `filter.sort.column` straight into the JSX made the compiler cache that element against the whole filter object, costing one wasted commit per keystroke, and destructuring the primitives first fixed it.

## A hundred thousand rows, thirty-five in the DOM

*Misconception: A 100,000-row ledger needs a backend and pagination.*

The ledger worker builds typed-array columns over all 100,000 transactions once and answers every filter, search and sort with ids only, plus the totals.

The answer is an exactly sized `Int32Array` whose buffer is transferred rather than copied, and the main thread renders each visible row from `transaction(id)`, a pure, constant-time function of the index.

No row data crosses the worker boundary, there is no page-window protocol to keep in step with the scroll position, and a result is one allocation and one transfer however far the user scrolls.

That only works because the world is deterministic: `transaction(i)` seeds its own PRNG stream from the world seed and the index, so the main thread and the worker generate the same row independently.

A Vitest test generates the world twice and pins its fingerprint, and `Math.random`, `Date.now` and argument-less `new Date()` are banned outside the feed clock and the performance HUD by ESLint and a source test, so the ledger cannot drift between loads.

The table windows its rows against the page scroller: at 1440 x 950 it holds 35 rows mid-scroll and 29 at the end, while `aria-rowcount` reports the full set.

Roving focus is keyed by row, so it survives recycling and re-sorting, and Page Up and Page Down move by the visible row count read from the live layout at key time, so Page Up undoes a Page Down.

Filter state lives in the URL alone, so Back steps through filter states and leaves a search in one step.

The longest interaction while filtering and searching measured 16 to 24 ms across five local runs on a 4x CPU throttle, against a 50 ms budget that CI asserts on every push.

## Popovers without a positioning library

*Misconception: Menus and tooltips need a positioning library.*

Menu and Tooltip are built on the Popover API and CSS anchor positioning, with no positioning code at all.

Each instance derives a dashed ident from `useId()`, writes `anchor-name` on the trigger and `position-anchor` on the panel through ref callbacks, and the CSS Module places the panel with `position-area` and flips it with `position-try-fallbacks`.

The menu is a `popover="auto"` panel opened by a `popovertarget` button, so Escape and light dismiss come from the platform rather than from event handlers.

Menus, tooltips and dialogs all render in the top layer, so the design tokens carry no popover or dialog z-index to keep in order.

The chart tooltip is the honest edge case: script writes the active bar's box into custom properties on the plot, and CSS anchor positioning places the tooltip beside it, flipping to the left near the right edge and then above, so it never covers the bar it describes.

Script places the anchor box over the bar; it never computes where the tooltip goes.

The cost is a browser floor of Chromium 129, Safari 26 and Firefox 147, with no production polyfill.

## Undo after commit

*Misconception: Optimistic UI is a trade against correctness.*

Category edits, card freezes and budget edits apply at once and commit after a simulated 400 ms latency, each with an Undo toast.

The pending actions live in an external store whose merged view every reader shares, with `useOptimistic` only at the detail page's `Select`, so the ledger rows, the worker's category overlay and the detail page all see the same pending edit.

Each row selects its own id from that merged view through `useSyncExternalStore`, so a pending categorisation re-renders only the rows whose category changes.

Undo is where optimistic interfaces usually cut corners.

Undoing a pending action cancels its timer and writes nothing; undoing a committed one restores the previous value only while the stored value is still what the action set, so a change made in another tab in the meantime is left alone unless it wrote the very value the action set.

When a later action was layered on the undone one, it inherits the undone action's previous value, so undoing out of order still lands on the right state.

A property test runs 150 seeded sequences of 40 steps across all three kinds of edit, with undos of pending and committed actions in any order and writes from outside the layer, and after every step checks the stored edits and the merged view against a replayed model.

An Undo toast stays for 10 seconds rather than the usual 6, so a keyboard user can reach its button from the control that raised it, and focus or hover inside the region pauses it.

## Ledger ink

The design language is a ruled book of first entry: a paper surface, ink text, horizontal rules instead of boxes, tabular figures, and a bottle green accent that reads as ink rather than fintech.

Tokens are semantic roles with `light-dark()` values, so one declaration carries both themes, and `prefers-contrast: more` and `forced-colors: active` adjust the same tokens.

The component library in `src/ui/` is plain CSS Modules with no `style` props and no `!important`; dynamic values go through data attributes or custom properties written through a ref.

The `/design` page is its documentation, and it measures instead of asserting: a hidden probe resolves every token in the browser, so `light-dark()` and `clamp()` are settled by the engine rather than copied from a document.

It measures 30 contrast pairs at runtime in the current theme, cuts each ratio to two decimals so a shown value never flatters the measurement, and measures again when the theme changes.

A unit test guards the same pairs from the token source, so a failing pair fails CI before it reaches the page.

Measuring caught a real defect: the original strong border came in as low as 2.32 to 1 against the surfaces, under the 3 to 1 minimum for non-text contrast, so the token moved further from the surfaces in both themes, darker in light and lighter in dark, rather than the rule being relaxed.

## Verified end to end

The bundle budget, the dependency count and the single inline script are build-time checks: `scripts/verify-bundle.mjs` fails on any runtime dependency besides `react` and `react-dom`, on initial JavaScript over budget, or unless `dist/index.html` holds exactly one inline script whose hash the Content Security Policy pins.

Unit tests cover the world generator, the worker's index and queries, the optimistic layer and the components, with Profiler counts behind every re-render claim and a URL codec property test that round-trips 500 seeded states.

The Playwright suite runs against the built app under the real Content Security Policy, and 77 end-to-end tests passed on the CI runner, covering axe, keyboard paths, zero policy violations, the DOM row count and layout shift.

Lighthouse CI asserts 100 in all four categories and zero layout shift on `/`, `/transactions` and `/design` on every push.

## The result

The shipped app depends on `react` and `react-dom` alone, loads 86 KB of gzipped JavaScript before first paint against an 87 KB budget, and scores 100 in every Lighthouse category on the desktop preset with a layout shift of zero.

On Lighthouse's mobile settings, performance measures 97 on two routes and 94 on the design page, because nothing paints until the initial JavaScript has loaded on simulated slow 4G.

Each headline claim lives where it can be checked: the re-render count in a Profiler test, popover placement in the browser's own anchor positioning, and the undo rule in a property test against a replayed model.
