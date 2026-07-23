export interface MarkerCategory {
  id: string;
  label: string;
  /** CSS hex color used for the marker pin and filter toggle */
  color: string;
}

export interface Marker {
  id: string;
  /** Slug of the map this marker belongs to */
  mapSlug: string;
  name: string;
  /** URL-safe identifier used in the ?marker= query param */
  slug: string;
  /** Must match a MarkerCategory.id for the same map */
  category: string;
  /** Normalized percentage of map width — 0 = left edge, 100 = right edge */
  x: number;
  /** Normalized percentage of map height — 0 = top edge, 100 = bottom edge */
  y: number;
  shortDescription: string;
  description: string;
  /** Additional terms matched during client-side search */
  searchTerms: string[];
  isFeatured: boolean;
  /** Fictional loot availability rating 1–5 (1 = scarce, 5 = abundant) */
  lootLevel: number;
  /** Fictional danger rating 1–5 (1 = low, 5 = extreme) */
  dangerLevel: number;
}
