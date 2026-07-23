# Map Engine Architecture — Milestone 3B

Reference: `MAP_DATA_SOURCE.md` for asset legality status.

---

## A. MVP Scope

### Included

- Interactive viewport with pan and zoom
- Neutral fictional grid background (no external assets)
- Marker rendering with category-based icons
- Marker selection and detail panel
- Category filter toggles
- Location search (client-side, no API)
- Responsive desktop layout and mobile drawer
- Configuration-driven multi-map registry (no hardcoded Chernarus)

### Explicitly excluded from MVP

Accounts, saved favorites, multiplayer collaboration, live server positions,
routes and pathfinding, heatmaps, clans, premium features, database, public
API, analytics, real advertising, and real DayZ terrain assets.

---

## B. Technology Decision

### Evaluated options

| Option | Pro | Con |
|---|---|---|
| **Leaflet + react-leaflet** | `CRS.Simple` handles non-geographic image maps natively; mature; minimal setup for pan/zoom/markers; react-leaflet gives idiomatic React integration; DayZ community precedent | Requires dynamic import to avoid SSR; bundle adds ~450 KB |
| MapLibre GL JS | WebGL performance; vector tile support | Designed for geographic data; heavy; complex setup for fictional maps; overkill |
| Custom DOM/Canvas | Zero dependencies | Must implement pan, zoom, clustering, and event handling from scratch — high implementation risk, slow delivery |

### Decision: Leaflet + react-leaflet

Leaflet's `CRS.Simple` coordinate reference system treats the map as a flat
pixel grid — exactly the model needed for a fictional or image-based map with
no geographic projection. Pan, zoom, marker layers, and event handling are
provided out of the box. The SSR conflict is resolved with a single
`next/dynamic` call on the Chernarus page; the page itself stays
server-rendered.

When real Chernarus terrain tiles are licensed, they slot into Leaflet as a
standard `TileLayer` or `ImageOverlay` with no component restructuring.

**Packages to install in Milestone 3B:**

```
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

---

## C. Multi-Map Architecture

No component may reference `"chernarus"` as a string literal.
All map behavior is driven by a configuration object loaded by slug.

### TypeScript interfaces

The following types extend the existing `src/types/map.ts` without breaking
current usage. New engine-specific types go in dedicated files.

#### `src/types/map-engine.ts`

```typescript
import type { MapDefinition } from "./map";

export interface MapBounds {
  /** Logical pixel width of the full map image */
  width: number;
  /** Logical pixel height of the full map image */
  height: number;
  /** Leaflet LatLngBounds expressed as [[south, west], [north, east]]
   *  in CRS.Simple pixel coordinates */
  leafletBounds: [[number, number], [number, number]];
}

export interface MapZoomConfig {
  min: number;
  max: number;
  default: number;
  /** Scroll-wheel zoom step */
  wheelStep: number;
}

/** Full engine configuration for one map. Consumed by InteractiveMap. */
export interface MapEngineConfig extends MapDefinition {
  bounds: MapBounds;
  zoom: MapZoomConfig;
  /** [x, y] in normalized 0–100 coordinates */
  defaultCenter: [number, number];
}
```

#### `src/types/marker.ts`

```typescript
export interface MarkerCategory {
  id: string;
  label: string;
  /** Tailwind or hex color used for the marker pin */
  color: string;
}

export interface Marker {
  id: string;
  mapSlug: string;
  name: string;
  /** URL-safe identifier, used in ?marker= query param */
  slug: string;
  /** Matches MarkerCategory.id */
  category: string;
  /** Normalized 0–100, percentage of map width */
  x: number;
  /** Normalized 0–100, percentage of map height */
  y: number;
  shortDescription: string;
  description: string;
  /** Additional terms matched during search */
  searchTerms: string[];
  isFeatured: boolean;
}
```

### Map registry

`src/lib/maps.ts` (existing) stays as the public listing source.
`src/data/maps/[slug]/config.ts` holds the engine config for each map.
`src/data/maps/[slug]/markers.ts` holds that map's marker array.

The registry loader in `src/lib/map-engine/registry.ts` exports:

```typescript
import type { MapEngineConfig } from "@/types/map-engine";
import { chernarusConfig } from "@/data/maps/chernarus/config";

const MAP_REGISTRY: Record<string, MapEngineConfig> = {
  chernarus: chernarusConfig,
};

export function getMapConfig(slug: string): MapEngineConfig | null {
  return MAP_REGISTRY[slug] ?? null;
}
```

Adding Livonia or Sakhal later requires: one new `config.ts`, one new
`markers.ts`, and one new key in `MAP_REGISTRY`. No component changes needed.

---

## D. Coordinate Model

### Internal system

All marker positions are stored as **normalized percentage coordinates**:

```
x ∈ [0, 100]   percentage of map logical width  (0 = left edge)
y ∈ [0, 100]   percentage of map logical height (0 = top edge)
```

This is map-size-independent. A marker at `{ x: 50, y: 50 }` is always the
centre of any map.

### Conversion to Leaflet CRS.Simple

Leaflet's `CRS.Simple` uses pixel coordinates where `[0, 0]` is the
bottom-left. For a map with `bounds.width = W` and `bounds.height = H`:

```
leafletLat = H - (y / 100) * H   // flip Y axis
leafletLng = (x / 100) * W
```

Encapsulated in one utility: `normalizedToLeaflet(x, y, bounds): LatLng`.

### Future adaptations

| Target | Adaptation |
|---|---|
| Real tile coordinates | Replace the conversion function; marker data is unchanged |
| DayZ world coordinates | Apply a linear transform: `worldX = x_offset + (x / 100) * scale` |
| URL sync (`?x=50&y=50`) | Normalized values serialize directly — no decoding needed |

---

## E. Marker Data Model

Markers live in `src/data/maps/[slug]/markers.ts` as typed TypeScript arrays.
No database is used in MVP. The format is the `Marker` interface from section C.

### Milestone 3B seed data

`src/data/maps/chernarus/markers.ts` will contain **10 fictional demonstration
markers** across **4 fictional categories**:

| Category id | Label | Color |
|---|---|---|
| `military` | Military | `#ef4444` (red) |
| `town` | Town | `#f59e0b` (amber) |
| `medical` | Medical | `#22c55e` (green) |
| `industrial` | Industrial | `#6366f1` (indigo) |

Marker names and positions are entirely fictional (e.g. "North Grid Base",
"Eastport Town", "Field Hospital", "Factory District"). They exist only to
demonstrate filters, search, and the detail panel. None are derived from DayZ
game data.

---

## F. Component Architecture

All components below live in `src/components/map/`.

The Chernarus page (`src/app/maps/chernarus/page.tsx`) remains a **server
component**. It imports `InteractiveMap` via `next/dynamic({ ssr: false })`.
Everything below `InteractiveMap` is client-side.

| Component | `"use client"` | Responsibility |
|---|---|---|
| `InteractiveMap` | **Yes** — entry point | Loads map config and markers by slug; owns `MapProvider`; dynamic-imported by the page |
| `MapViewport` | **Yes** (via parent) | Leaflet `MapContainer` with `CRS.Simple`; configures bounds and zoom |
| `NeutralMapBackground` | **Yes** (via parent) | Renders a CSS grid pattern as the Leaflet base layer; no image assets |
| `MarkerLayer` | **Yes** (via parent) | Iterates filtered markers; renders `MapMarker` for each |
| `MapMarker` | **Yes** (via parent) | Leaflet `Marker` as a `<button>`; announces name and category to screen readers |
| `MapToolbar` | **Yes** | Renders `MapSearch` and `MapFilters` in one row; keyboard-navigable |
| `MapSearch` | **Yes** | Controlled text input; clears on Escape |
| `MapFilters` | **Yes** | One toggle button per category; reads and updates `enabledCategories` |
| `MarkerDetailPanel` | **Yes** | Desktop: fixed side panel; `role="dialog"`, `aria-modal`, focus trap, Escape closes |
| `MobileMapDrawer` | **Yes** | Mobile: bottom sheet triggered by marker selection; slides up; same content as detail panel |

`NeutralMapBackground`, `MarkerLayer`, and `MapMarker` do not need their own
`"use client"` directive because they are always children of `MapViewport`,
which is itself always inside the client-boundary established by
`InteractiveMap`.

---

## G. State Architecture

State lives in a single `MapContext` defined in
`src/lib/map-engine/context.tsx`. It is provided by `InteractiveMap` and
consumed by all map child components via `useMapContext()`.

```typescript
interface MapState {
  zoom: number;
  center: [number, number];           // normalized [x, y]
  enabledCategories: Set<string>;
  selectedMarkerId: string | null;
  searchQuery: string;
  mobilePanelOpen: boolean;
}
```

**No Redux. No Zustand. No external state library.**

Derived state is computed in hooks, not stored:

```
useFilteredMarkers(markers, enabledCategories, searchQuery) → Marker[]
```

This hook uses `useMemo`; it recomputes only when `markers`,
`enabledCategories`, or `searchQuery` changes.

`MapContext` is scoped to the `InteractiveMap` subtree. It has no effect on
the Header, Footer, or any other page.

---

## H. URL Strategy

Target format (not implemented in Milestone 3B):

```
/maps/chernarus?x=50.0&y=37.2&z=2&marker=north-grid-base
```

| Param | Type | Description |
|---|---|---|
| `x` | float 0–100 | Map centre x (normalized) |
| `y` | float 0–100 | Map centre y (normalized) |
| `z` | integer | Zoom level |
| `marker` | string | Marker slug; opens detail panel on load |

The Milestone 3B implementation stores all state in React only. The component
interfaces are designed to accept initial values as props, so URL-to-state
hydration can be added in a later step by reading `useSearchParams()` in
`InteractiveMap` and passing values to `MapContext` as initial state.
No restructuring will be required.

---

## I. Performance Rules

- `InteractiveMap` is dynamically imported with `next/dynamic` and
  `{ ssr: false }`. The Chernarus page remains statically prerendered;
  the map loads client-side after hydration.
- `useFilteredMarkers` is wrapped in `useMemo`. Filter and search operations
  run in JavaScript and are fast for up to ~500 markers without additional
  optimisation.
- If marker count exceeds ~500, use `leaflet.markercluster` before reaching
  for a Canvas strategy.
- `MapMarker` is not re-rendered when an unrelated marker is selected.
  Selection state is read from context only where needed.
- No Leaflet instance is created during SSR. All Leaflet calls are inside
  `useEffect` or react-leaflet hooks which run only in the browser.
- Static pages (`/`, `/maps`, `/about`, `/contact`) remain server-rendered
  with zero Leaflet code.

---

## J. Accessibility Rules

- **Toolbar**: `role="toolbar"`, arrow-key navigation between filter buttons
  and the search input.
- **Search input**: `<label>` associated via `htmlFor`; clear button with
  `aria-label="Clear search"`.
- **`MapMarker`**: rendered as `<button type="button">` with
  `aria-label="{name} — {category}"`.
- **`MarkerDetailPanel`**: `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby` pointing to the marker name heading. Focus moves to the
  panel on open; Escape closes it and returns focus to the triggering marker.
- **`MobileMapDrawer`**: same dialog semantics as the detail panel.
- **Focus ring**: every interactive element inherits the
  `focus-visible:ring-2 focus-visible:ring-amber-500` pattern established in
  Milestone 2.
- **Touch targets**: all interactive controls are at least 44 × 44 px on
  mobile.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables
  Leaflet `flyTo` and `zoomIn` animations; use `setView` and `setZoom`
  (instant) instead.

---

## K. Folder Architecture for Milestone 3B

Files to create (all inside `apps/web/src/`):

```
src/
├── types/
│   ├── map.ts                         EXISTING — no change
│   ├── map-engine.ts                  NEW — MapBounds, MapZoomConfig, MapEngineConfig
│   └── marker.ts                      NEW — Marker, MarkerCategory
│
├── data/
│   └── maps/
│       └── chernarus/
│           ├── config.ts              NEW — MapEngineConfig for Chernarus
│           └── markers.ts             NEW — 10 fictional demo markers
│
├── lib/
│   ├── maps.ts                        EXISTING — no change
│   └── map-engine/
│       ├── registry.ts                NEW — getMapConfig(slug)
│       ├── context.tsx                NEW — MapContext, MapProvider, useMapContext
│       ├── hooks.ts                   NEW — useFilteredMarkers, useMarkerSearch
│       └── coordinates.ts             NEW — normalizedToLeaflet(), leafletToNormalized()
│
└── components/
    ├── layout/                        EXISTING — no change
    ├── ui/                            EXISTING — no change
    ├── MapPlaceholder.tsx             EXISTING — removed from /maps/chernarus after 3B
    └── map/
        ├── InteractiveMap.tsx         NEW — client entry point, owns MapProvider
        ├── MapViewport.tsx            NEW — Leaflet MapContainer, CRS.Simple
        ├── NeutralMapBackground.tsx   NEW — CSS grid base layer, no assets
        ├── MarkerLayer.tsx            NEW — iterates filtered markers
        ├── MapMarker.tsx              NEW — single marker as <button>
        ├── MapToolbar.tsx             NEW — toolbar shell
        ├── MapSearch.tsx              NEW — search input
        ├── MapFilters.tsx             NEW — category toggle buttons
        ├── MarkerDetailPanel.tsx      NEW — desktop side panel
        └── MobileMapDrawer.tsx        NEW — mobile bottom drawer
```

Files to modify in Milestone 3B:

```
src/app/maps/chernarus/page.tsx    Replace MapPlaceholder with InteractiveMap
```

Total: **14 new files**, **1 modified file**.

---

## L. Implementation Sequence

### Step 1 — Types and data layer
Extend `src/types/map.ts`; create `src/types/map-engine.ts` and
`src/types/marker.ts`; create `src/data/maps/chernarus/config.ts` (engine
config) and `src/data/maps/chernarus/markers.ts` (10 fictional markers, 4
categories); create `src/lib/map-engine/registry.ts`,
`src/lib/map-engine/context.tsx`, `src/lib/map-engine/hooks.ts`, and
`src/lib/map-engine/coordinates.ts`. No UI yet. Run `npm run build` to
confirm zero type errors.

### Step 2 — Map viewport
Install `leaflet`, `react-leaflet`, `@types/leaflet`. Create `MapViewport`
(Leaflet `MapContainer` with `CRS.Simple` and fictional bounds) and
`NeutralMapBackground` (CSS grid on the container background). Create
`InteractiveMap` as the client entry point and wire it into the Chernarus page
via `next/dynamic({ ssr: false })`. Verify pan and zoom work; confirm no SSR
errors; confirm static build succeeds.

### Step 3 — Marker layer
Create `MapMarker` (Leaflet custom icon rendered as a coloured dot, wrapped in
a `<button>`) and `MarkerLayer` (reads filtered markers from context, renders
one `MapMarker` per entry). Load the 10 fictional markers. Verify all markers
appear at correct positions on the neutral background; verify no marker
references real DayZ data.

### Step 4 — Toolbar: search and filters
Create `MapSearch` (debounced text input), `MapFilters` (one toggle per
category), and `MapToolbar` (shell that composes them above the viewport).
Wire `enabledCategories` and `searchQuery` into `MapContext`. Verify that
toggling a category hides and shows its markers and that typing in search
narrows the visible set.

### Step 5 — Detail panel and mobile drawer
Create `MarkerDetailPanel` (desktop: fixed right panel) and
`MobileMapDrawer` (mobile: bottom sheet). Wire `selectedMarkerId` in
`MapContext` so clicking a marker opens the appropriate panel. Implement focus
trap and Escape-key close. Verify the panel shows correct marker data; verify
mobile drawer opens on tap; verify keyboard navigation closes the panel.

### Step 6 — Integration and acceptance
Replace the placeholder toolbar in `src/app/maps/chernarus/page.tsx` with the
live `InteractiveMap`. Run full acceptance criteria (see section M). Run
`npm run lint`, `npm run build`. Confirm zero errors, zero warnings.

---

## M. Acceptance Criteria

### Functionality
- [ ] Map viewport renders on `/maps/chernarus` with pan and zoom working
- [ ] All 10 fictional markers are visible on the neutral background
- [ ] Toggling a category hides and shows the correct markers
- [ ] Typing in search filters visible markers by name and searchTerms
- [ ] Clicking a marker opens the detail panel with correct name, category, and description
- [ ] Detail panel closes on Escape and on the close button
- [ ] Mobile drawer opens and closes correctly on small viewports
- [ ] Other pages (`/`, `/maps`, `/about`, `/contact`) are unaffected

### Responsive layout
- [ ] Toolbar stacks correctly on mobile without overflow
- [ ] Detail panel renders as a bottom drawer on mobile and as a side panel on desktop
- [ ] Map fills its container on all breakpoints

### Accessibility
- [ ] Toolbar buttons are keyboard-reachable via Tab
- [ ] Each marker button announces name and category to a screen reader
- [ ] Detail panel traps focus and is announced as a dialog
- [ ] All interactive controls have a visible focus ring
- [ ] Page passes the Next.js built-in accessibility linter (eslint-config-next)
- [ ] `prefers-reduced-motion` disables animated map transitions

### Build and quality
- [ ] `npm run lint` — zero errors, zero warnings
- [ ] `npm run build` — zero type errors, zero build errors
- [ ] All new routes remain statically prerendered except the client map component

### Legal
- [ ] Zero DayZ, Chernarus, Bohemia Interactive, iZurvive, Steam, or
      community map image assets in the codebase
- [ ] All marker data is demonstrably fictional (no real DayZ location names
      or coordinates)
- [ ] `MAP_DATA_SOURCE.md` still reflects the unresolved real-asset status

### Scope
- [ ] No new routes outside `/maps/chernarus` were modified
- [ ] `blueprint/`, root `README.md`, `LICENSE`, and root `.gitignore` are untouched
- [ ] `node_modules` and `.next` are not tracked by Git
