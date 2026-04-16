# CLAUDE.md — Retro Arcade Legends

> This file is the single source of truth for Claude Code when working on this project.
> Read it fully before taking any action. Follow every instruction here precisely.

---

## Project identity

- **Name:** retro-arcade-legends
- **Purpose:** A statically-generated tradable card explorer built with Astro, used as a live coding demo for a tech talk on Claude Code
- **Theme:** Legendary characters, machines, and moments from arcade gaming history (1970s–1990s)
- **Demo goal:** Show Astro's island architecture — near-zero JS by default, opt-in dynamic islands

---

## Tech stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Astro | 4.x |
| Islands | React | 18 |
| Styling | Tailwind CSS | 3.x |
| Icons | Lucide React | latest |
| Package manager | pnpm | latest |
| Fonts | Press Start 2P, Inter, JetBrains Mono | via Google Fonts |

---

## Core rules — read before writing any code

1. **Astro components are zero-JS by default.** Never add `<script>` tags or import React into `.astro` files unless explicitly building an island.
2. **Islands live in `src/components/islands/`.** All `.tsx` files go here. All `.astro` files go in `src/components/astro/`.
3. **Every island must declare its hydration directive at the call site** (in the `.astro` page that uses it), not inside the component itself.
4. **`src/data/cards.json` is the single source of truth.** Never hard-code card data anywhere else. Always import from this file.
5. **Never use inline styles.** Use Tailwind utility classes or CSS custom properties defined in `src/styles/global.css`.
6. **Dark mode is mandatory.** Every component must work correctly in both light and dark mode using the `dark:` Tailwind prefix.
7. **No TypeScript errors.** Run `pnpm typecheck` before considering any task complete.
8. **No build warnings.** Run `pnpm build` and confirm zero warnings before considering any task complete.

---

## Data model

Each card in `src/data/cards.json` must conform to this schema exactly:

```typescript
interface Card {
  id: string;          // URL slug, e.g. "pac-man"
  name: string;        // Display name, e.g. "Pac-Man"
  type: "character" | "machine" | "moment";
  era: "1970s" | "1980s" | "1990s";
  rarity: "common" | "rare" | "legendary";
  influence: number;   // 1–100, how much it shaped games that followed
  quarters: number;    // 1–100, how aggressively it ate your coins (difficulty/addictiveness)
  legacy: number;      // 1–100, enduring cultural impact score
  description: string; // 2–3 sentence flavour text
  quote: string;       // Iconic line or tagline
  colour: string;      // Hex colour for card accent, e.g. "#FFB800"
  tags: string[];      // e.g. ["maze", "arcade", "1980"]
  studio: string;      // Original developer/publisher
  debut: number;       // Year of first appearance
}
```

The dataset must contain exactly **30 cards** with a spread across:
- All three types (character, machine, moment)
- All three eras (1970s, 1980s, 1990s)
- All three rarities — roughly: 15 common, 10 rare, 5 legendary

---

## Pages and routes

| Route | File | Rendering | Notes |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Static | Hero, featured cards, SearchBar island |
| `/cards` | `src/pages/cards/index.astro` | Static | Full grid, FilterPanel + SortSelect islands |
| `/cards/[id]` | `src/pages/cards/[id].astro` | Static ×30 | Card detail, FavouriteButton island |
| `/compare` | `src/pages/compare.astro` | Static | CompareWidget island |
| `/about` | `src/pages/about.astro` | Static | No islands |
| `/404` | `src/pages/404.astro` | Static | Arcade-themed message, no islands |

`/cards/[id]` must use `getStaticPaths()` to pre-render all 30 cards at build time.

---

## Components

### Astro components (zero JS — `src/components/astro/`)

| File | Responsibility |
|---|---|
| `Layout.astro` | Root shell: nav, footer, meta tags, font imports, global styles |
| `CardGrid.astro` | Responsive CSS grid wrapper, accepts `cards` prop |
| `CardThumbnail.astro` | Card preview tile for listing pages |
| `CardDetail.astro` | Full card layout for `/cards/[id]` |
| `StatBar.astro` | CSS-animated stat bar (influence, quarters, legacy) |
| `RarityBadge.astro` | Colour-coded rarity pill |
| `EraTag.astro` | Decade badge |

### React islands (`src/components/islands/`)

| File | Directive | Behaviour |
|---|---|---|
| `SearchBar.tsx` | `client:load` | Live search across name, tags, studio — filters CardGrid in real time |
| `FilterPanel.tsx` | `client:load` | Checkbox filters for type, era, rarity |
| `SortSelect.tsx` | `client:load` | Sort by influence, quarters, legacy, name, or debut year |
| `FavouriteButton.tsx` | `client:idle` | Toggle favourite state, persist to localStorage |
| `FavouritesDrawer.tsx` | `client:idle` | Slide-out drawer listing all favourited cards |
| `CompareWidget.tsx` | `client:visible` | Pick two cards via dropdown, render side-by-side stat diff |

Islands receive card data as serialised props passed from the parent `.astro` page. They must not fetch data themselves.

---

## Design tokens

Define these as CSS custom properties in `src/styles/global.css`:

```css
:root {
  --arcade-red:    #CC3300;  /* Legendary rarity, primary CTAs */
  --arcade-gold:   #FFB800;  /* Rare rarity, highlights */
  --arcade-teal:   #00B4AA;  /* Character type badge */
  --arcade-purple: #7B2FBE;  /* Machine type badge */
  --arcade-green:  #00A86B;  /* Moment type badge */
  --bg-dark:       #0D0D0D;  /* Page background */
  --bg-card:       #1A1A2E;  /* Card surface */
  --text-primary:  #F0F0F0;  /* Body text */
  --text-muted:    #888888;  /* Secondary text */
}
```

**Typography:**
- Card names / display headings: `Press Start 2P` — the authentic arcade font
- Body / UI text: `Inter`
- Stat numbers: `JetBrains Mono`

---

## Special visual effects

### Holographic shimmer (legendary cards only)
Implement using CSS only — no JavaScript. Use a `@keyframes` animation on a `::before` pseudo-element with a rotating `conic-gradient` or `linear-gradient`. Apply only when `card.rarity === "legendary"`. The effect must respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: no-preference) {
  .card--legendary::before {
    /* shimmer implementation here */
  }
}
```

### Stat bars
Animate from 0 to the actual value on page load using a CSS `@keyframes` width transition. No JavaScript required. Set the target width via a CSS custom property passed as an inline style from the Astro component:

```astro
<div class="stat-bar" style={`--stat-value: ${value}%`} />
```

### Page transitions
Use Astro's built-in View Transitions API (`<ViewTransitions />` in `Layout.astro`). Do not install a third-party animation library.

---

## File structure

```
retro-arcade-legends/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── astro/
│   │   │   ├── Layout.astro
│   │   │   ├── CardGrid.astro
│   │   │   ├── CardThumbnail.astro
│   │   │   ├── CardDetail.astro
│   │   │   ├── StatBar.astro
│   │   │   ├── RarityBadge.astro
│   │   │   └── EraTag.astro
│   │   └── islands/
│   │       ├── SearchBar.tsx
│   │       ├── FilterPanel.tsx
│   │       ├── SortSelect.tsx
│   │       ├── FavouriteButton.tsx
│   │       ├── FavouritesDrawer.tsx
│   │       └── CompareWidget.tsx
│   ├── data/
│   │   └── cards.json
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cards/
│   │   │   ├── index.astro
│   │   │   └── [id].astro
│   │   ├── compare.astro
│   │   ├── about.astro
│   │   └── 404.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
└── package.json
```

---

## Package.json scripts

```json
{
  "scripts": {
    "dev":       "astro dev",
    "build":     "astro build",
    "preview":   "astro preview",
    "typecheck": "tsc --noEmit",
    "lint":      "eslint src --ext .ts,.tsx,.astro"
  }
}
```

---

## astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
});
```

---

## Acceptance criteria

The project is complete when **all** of the following pass:

- [ ] `pnpm build` completes with zero errors and zero warnings
- [ ] All 30 card pages exist as static `.html` files in `dist/cards/`
- [ ] A plain card detail page (`/cards/pac-man`) ships **0 KB of JavaScript**
- [ ] Search filters the card grid in real time with no page reload
- [ ] Favourites persist correctly across browser refreshes via `localStorage`
- [ ] `CompareWidget` does not initialise until it is scrolled into the viewport
- [ ] Legendary cards display a holographic shimmer animation
- [ ] All shimmer and stat bar animations are suppressed under `prefers-reduced-motion`
- [ ] Dark mode is correct on every page and component
- [ ] The site is fully navigable with JavaScript disabled (except islands are inert, not broken)
- [ ] Lighthouse performance score ≥ 95 on `/cards/pac-man`
- [ ] `pnpm typecheck` exits with zero errors

---

## Build order for Claude Code

Follow this sequence. Complete and verify each step before starting the next.

1. **Scaffold** — init Astro project, install dependencies, create empty file structure
2. **Data** — generate `cards.json` with all 30 cards matching the schema
3. **Static layer** — build all `.astro` components and pages, confirm `pnpm build` passes
4. **Islands** — add all React islands, wire into pages with correct `client:` directives
5. **Polish** — fonts, dark mode, View Transitions, 404 page, accessibility pass
6. **Verify** — run full acceptance criteria checklist above
