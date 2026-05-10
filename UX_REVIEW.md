# Summer 2026 — UX & Navigation Review

A focused review of [index.html](index.html), [styles.css](styles.css), [app.js](app.js), and [data.js](data.js). The visual language is strong (Newsreader/Inter pairing, generous whitespace, the soft palette, the Material icons, the sticky pill nav). The problem is **structure, not style** — so the recommendations below preserve the look and feel and only change *how the content is partitioned and traversed*.

---

## 1. The core problem

The current page renders **every destination in every section**:

| Section | Per-destination cost | × 10 destinations |
|---|---|---|
| Portfolio cards | ~500 px tall (image + body + climate bar) | ~5,000 px |
| Details blocks | 320 px hero + arguments + highlights + links (~700 px) | ~7,000 px |
| Control Center | ~340 px (status + pro/con + note) | ~3,400 px |
| Map | 1 marker each | bounded |

That's roughly **15,000–18,000 px of scroll on desktop** and considerably more on mobile, with the same destination appearing **four times** (summary, card, detail, control). The anchor nav (`#compare`, `#details`, `#control`, `#map`) jumps around inside one giant document — but once you've jumped, there's no way back except scrolling, and you can't focus on a single destination.

The information itself is well-modeled in [data.js](data.js) (`board.read`, `board.pros`, `board.cons`, `arguments`, `highlights`, `links`, `category`, `type`). Several of these fields aren't even surfaced in the UI today (`board.read`, `board.pros`, `board.cons` are loaded but never rendered). That's a sign the page ran out of room for its own data.

---

## 2. Recommended architecture: hash-routed views in one file

You don't need a framework, a build step, or to split into separate `.html` files. The cleanest path:

> **Keep `index.html` as a single shell. Add a tiny hash router that shows one "view" at a time.**

Why this over real multi-page:

- **State already lives in localStorage** — preferences, favorites, control, ranking. No server, no rehydration to think about.
- **Map and Leaflet load once** — re-instantiating Leaflet on each page is wasteful.
- **Browser back/forward "just works"** with `hashchange`.
- **Zero duplication** — your CSS, fonts, and data load once.
- **Reversible** — if you hate it after a week, delete the router and you're back to anchors.

A hash router is ~30 lines of vanilla JS. Sketch:

```js
const routes = {
  "":            renderOverview,
  "compare":     renderCompare,
  "destination": renderDestination, // /#/destination/costa
  "decide":      renderDecide,
  "map":         renderMap
};
function route() {
  const [view, param] = location.hash.replace(/^#\/?/, "").split("/");
  document.querySelectorAll("[data-view]").forEach(el => el.hidden = true);
  (routes[view] || routes[""])(param);
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
```

The sticky pill nav at the top stays — it just becomes a real router instead of an anchor list.

---

## 3. Proposed view structure

Five views, each with **one clear job**. Same components, same styles — just smaller surface area per view.

### View 1 — `/` Overview (the landing page)
- Keep the hero exactly as is.
- Keep the 4 `summaryCards` (the editorial "1. Costa Blanca …" tiles).
- Add a **Top 3 from your shortlist** strip (pulls from `ranking` in localStorage). If empty, prompt: *"Star destinations on Compare to build your shortlist."*
- Add a **map preview** (a small, non-interactive thumbnail or a 240px-tall Leaflet view) that links to the full map.
- Cut the 10-card portfolio from this page entirely.

This page should be **scannable in under 5 seconds** and answer "where are we in the decision?".

### View 2 — `/compare` Portfolio + Preferences
- The portfolio grid (10 cards) lives here, not on the home page.
- Move the **Preference Lab** to a collapsible drawer on this page (right side, sticky on desktop, bottom-sheet on mobile). It only matters when you're comparing — and changing weights here re-ranks the cards in front of you, which is the satisfying feedback loop.
- Add a **side-by-side compare mode**: let the user select 2 or 3 destinations (checkbox on each card) and switch to a column comparison view showing scores per criterion as bars. The data is already there — `destination.scores` keyed by preference. This is the feature the section *promises* but doesn't deliver today.
- Add **grouping/sorting controls**: by `category` (Achim Track / Safe Win / Wildcard / Urban Coast / Fiona Proposition), by `travel`, by `type` (nature/urban), or by fit. Right now `category` is a kicker label only, but it's actually a meaningful editorial axis — surface it.

### View 3 — `/destination/:id` Single destination deep dive
- This is the biggest UX win. Today, the "Details" section is **10 full-bleed heroes stacked**, which means every destination competes with every other and you can't actually *read* one.
- One destination per page: the existing `detail__hero` design works perfectly when it's the only thing on screen.
- Surface the unused data: `board.read` (the strategic summary), `board.pros`, `board.cons`, `board.weight`, `climate` block.
- Add **prev / next destination** chevrons at top and bottom (cycle the `data.destinations` order).
- Add a **breadcrumb** back to `/compare`.
- Embed a **mini-map** centred on this destination's coords (Leaflet has `setView`, easy).
- Add an inline **note + favourite + status** strip — pulled from the same `control` localStorage object so the user can edit thinking *here* without going to a separate "Control" tab. (This makes view 4 partly redundant — see below.)

### View 4 — `/decide` Decision board (the renamed Control Center)
- Today this is "every destination as a form, plus a shortlist on the right". It's the right idea but at the wrong density.
- Convert the 10 cards into a **compact table or kanban**: columns are `Active` / `Maybe` / `Out`, cards drag between columns. Status is already in `control[id].status` — just add a third state.
- Keep the **Shortlist** panel (it's the actual output of the whole tool), and make it the centerpiece of this view rather than a sidebar.
- Add a **decision summary** at the top: "You have 3 active favourites and a clear top pick: San Sebastian (88% fit)." This is the question every user is silently asking.
- Note + pro + con editing moves to the destination page (View 3) so you don't have to maintain two editing surfaces.

### View 5 — `/map` Full map
- Today the map is at the bottom — the easiest-to-grok overview is the hardest to find. Promote it to a top-level view.
- Keep the existing Leaflet setup. Add filter chips above the map (same as Compare: by `category`, `type`, favourites only).
- Clicking a marker should link to `/destination/:id`, not just popup.
- Add a **distance-from-Basel** label to each popup (cheap haversine on `coords`). Travel effort is one of your declared decision criteria — quantify it.

---

## 4. Concept-level upgrades

These are about what the tool *means*, not just where things go.

### 4a. The Decision Rule belongs everywhere, not just the hero

> *"Choose the best cancellable accommodation in a strong-fit area. A great house can beat a theoretically perfect destination."*

This is the most important sentence on the page and it disappears after first scroll. Promote it to a **persistent strip** on every view (one line, dismissable per session). It re-frames every other interaction.

### 4b. Three fit scores, not one

The current `fitScore()` returns a single shared % — but [data.js](data.js) already encodes that the family has **three perspectives**: Achim, Fiona, kids (in `arguments`). Compute a per-perspective fit:

- **Achim fit** — weight climbing, special, weather heavily.
- **Fiona fit** — weight urbanity, familyEase, calm.
- **Kids fit** — weight beach, familyEase, calm.

Show all three as small dots/bars on each card. The conversation the family is *actually* having is "this works for one of us but not the others" — let the tool show that directly. The shared `fitScore` becomes the average.

### 4c. Make the Pros/Cons visible

`board.pros` and `board.cons` are loaded but never rendered. They're the most opinionated, most useful content in the file. Put them on the destination page as two side-by-side columns — they're shaped exactly for that.

### 4d. The five categories are an editorial spine

`Achim Track`, `Fiona Proposition`, `Safe Win`, `Wildcard`, `Urban Coast` — these are the real mental model. Treat them as a **first-class navigation axis** on the Compare view. A grouped layout ("Here are the 4 Urban Coast options, here are the 2 Achim Track options…") matches how the family is actually thinking, far better than an alphabetical 10-card grid.

### 4e. Show what's been ruled out

When a destination's status is `out`, today it just disappears from filters. Better: **render it dimmed with a strikethrough on the Decide view** with the user's `con` field shown. The rejected options are part of the reasoning — keeping them visible explains *why* the shortlist looks the way it does.

### 4f. The "what's missing" gap

The data doesn't capture two things the family is implicitly deciding on:
- **Accommodation status** — the Decision Rule literally says the house decides it. There's no field for "Airbnb shortlisted", "tentatively booked", etc. Add a `housing` state (`none` / `searching` / `shortlisted` / `held` / `booked`) per destination.
- **Dates / availability** — every destination should have a target window. A single `dateRange` string ("Jul 18–Aug 1") per destination would do it.

These two together turn the tool from a *comparison toy* into a *plan*.

---

## 5. Quick wins (do today, no architecture change)

If multi-page feels like too much for one sitting, these are the highest-value isolated fixes:

1. **Render `board.read`, `board.pros`, `board.cons`** in the Details section. The data is already there. ~15 lines.
2. **Cap the Details section to one expanded destination at a time** (accordion). Currently all 10 are expanded by default; collapsing 9 of them cuts ~6,000 px of scroll instantly.
3. **Add per-perspective fit scores** (Achim/Fiona/Kids). One new function in [app.js](app.js).
4. **Move Preferences out of the main flow into a sticky drawer** triggered by a "Adjust priorities" button on the Compare and Decide sections.
5. **Add `loading="lazy"` to all the Unsplash images.** The Compare and Details sections each load 10 hero images on first paint.
6. **Surface the Decision Rule on every section header**, not just the hero.

---

## 6. Implementation order if you do the full restructure

1. Extract the `render*()` functions in [app.js](app.js) so each one writes into a `<section data-view="X">` container (already mostly the shape they're in).
2. Wrap the existing `<main>` children in `data-view="overview|compare|details|decide|map"` — the page still works as one scroll for now.
3. Add the hash router (~30 lines). Default route shows the overview view; others toggle visibility.
4. Convert the topbar `<a href="#compare">` links to `<a href="#/compare">` and the in-card "Open details" links to `#/destination/${id}`.
5. Split the Details section so it renders **one** destination based on the route param.
6. Decide which quick wins from §5 to fold in along the way.

You can ship steps 1–4 in one sitting and have a working multi-view app while keeping every existing pixel.

---

## 7. What *not* to change

- The colour palette, type pairing, and the sticky pill nav.
- The localStorage schema — it's clean, prefixed (`sv26.*`), and doesn't need migration if you keep the keys.
- The Leaflet setup — single-instance, low-config, exactly right.
- The 4-card editorial summary tiles — they're the most "human" part of the page.

The bones are good. The page just needs to stop trying to show you everything at once.
