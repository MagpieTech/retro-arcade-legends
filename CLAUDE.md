# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project identity

- **Name:** retro-arcade-legends
- **Purpose:** Statically-generated tradable card explorer built with Astro, used as a live coding demo for a tech talk on Claude Code
- **Theme:** Legendary characters, machines, and moments from arcade gaming history (1970s–1990s)
- **Demo goal:** Showcase Astro's island architecture — near-zero JS by default, opt-in dynamic islands

**Stack:** Astro 4.x · React 18 (islands only) · Tailwind CSS 3.x · Lucide React · pnpm

---

## Commands

```bash
pnpm dev         # Start dev server
pnpm build       # Production build (must pass with zero warnings)
pnpm preview     # Preview production build
pnpm typecheck   # tsc --noEmit (must pass before any task is done)
pnpm lint        # ESLint on src/**/*.{ts,tsx,astro}
```

**Every task is complete only when both `pnpm typecheck` and `pnpm build` pass with zero errors and zero warnings.**

---

## Architecture

### Island vs. Astro components

- **`src/components/astro/`** — Zero-JS `.astro` components. Never import React or add `<script>` tags here.
- **`src/components/islands/`** — Interactive `.tsx` React components. Each island is a self-contained unit; it must not fetch data itself — it receives serialised props from the parent `.astro` page.
- **Hydration directives belong at the call site** (the `.astro` page), never inside the island component.

### Island hydration directives

| Island | Directive | Reason |
|---|---|---|
| `SearchBar.tsx` | `client:load` | Needed immediately on page load |
| `FilterPanel.tsx` | `client:load` | Needed immediately on page load |
| `SortSelect.tsx` | `client:load` | Needed immediately on page load |
| `FavouriteButton.tsx` | `client:idle` | Non-critical, deferred |
| `FavouritesDrawer.tsx` | `client:idle` | Non-critical, deferred |
| `CompareWidget.tsx` | `client:visible` | Only needed when scrolled into view |

### Data

`src/data/cards.json` is the single source of truth. Never hard-code card data anywhere else.

```typescript
interface Card {
  id: string;          // URL slug, e.g. "pac-man"
  name: string;
  type: "character" | "machine" | "moment";
  era: "1970s" | "1980s" | "1990s";
  rarity: "common" | "rare" | "legendary";
  influence: number;   // 1–100
  quarters: number;    // 1–100
  legacy: number;      // 1–100
  description: string; // 2–3 sentence flavour text
  quote: string;
  colour: string;      // Hex, e.g. "#FFB800"
  tags: string[];
  studio: string;
  debut: number;       // Year
}
```

The dataset must contain exactly **30 cards**: all three types, all three eras, all three rarities (roughly 15 common / 10 rare / 5 legendary).

### Pages

`/cards/[id]` uses `getStaticPaths()` to pre-render all 30 card pages at build time. A plain card detail page must ship **0 KB of JavaScript**.

---

## Styling rules

- **Never use inline styles.** Use Tailwind utility classes or CSS custom properties from `src/styles/global.css`.
- **Dark mode is mandatory** on every component using the `dark:` Tailwind prefix.

### Design tokens (defined in `src/styles/global.css`)

```css
:root {
  --arcade-red:    #CC3300;  /* Legendary rarity, primary CTAs */
  --arcade-gold:   #FFB800;  /* Rare rarity, highlights */
  --arcade-teal:   #00B4AA;  /* Character type badge */
  --arcade-purple: #7B2FBE;  /* Machine type badge */
  --arcade-green:  #00A86B;  /* Moment type badge */
  --bg-dark:       #0D0D0D;
  --bg-card:       #1A1A2E;
  --text-primary:  #F0F0F0;
  --text-muted:    #888888;
}
```

**Typography:** `Press Start 2P` for card names/headings · `Inter` for body/UI · `JetBrains Mono` for stat numbers — all via Google Fonts.

---

## Special visual effects

### Holographic shimmer (legendary cards only)
CSS only — no JavaScript. `@keyframes` on a `::before` pseudo-element with a rotating gradient. Must respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: no-preference) {
  .card--legendary::before { /* shimmer */ }
}
```

### Stat bars
CSS `@keyframes` width animation, 0 → actual value. Target width via a CSS custom property set by the Astro component:

```astro
<div class="stat-bar" style={`--stat-value: ${value}%`} />
```

### Page transitions
Use Astro's built-in View Transitions API (`<ViewTransitions />` in `Layout.astro`). No third-party animation library.

---

## Build order

Follow this sequence and verify each step before proceeding:

1. **Scaffold** — init Astro project, install deps, create empty file structure
2. **Data** — generate `cards.json` with all 30 cards
3. **Static layer** — build all `.astro` components and pages; confirm `pnpm build` passes
4. **Islands** — add all React islands, wire with correct `client:` directives
5. **Polish** — fonts, dark mode, View Transitions, 404 page, accessibility
6. **Verify** — run full acceptance criteria checklist

---

## Acceptance criteria

- [ ] `pnpm build` — zero errors, zero warnings
- [ ] All 30 card pages exist as static `.html` files in `dist/cards/`
- [ ] `/cards/pac-man` ships **0 KB of JavaScript**
- [ ] Search filters the card grid in real time with no page reload
- [ ] Favourites persist across browser refreshes via `localStorage`
- [ ] `CompareWidget` does not initialise until scrolled into viewport
- [ ] Legendary cards display holographic shimmer animation
- [ ] Shimmer and stat bar animations suppressed under `prefers-reduced-motion`
- [ ] Dark mode correct on every page and component
- [ ] Site fully navigable with JavaScript disabled (islands inert, not broken)
- [ ] Lighthouse performance score ≥ 95 on `/cards/pac-man`
- [ ] `pnpm typecheck` exits with zero errors
