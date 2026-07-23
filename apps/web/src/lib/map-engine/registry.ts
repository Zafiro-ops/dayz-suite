import type { MapEngineConfig } from "@/types/map-engine";
import type { Marker, MarkerCategory } from "@/types/marker";
import { chernarusConfig } from "@/data/maps/chernarus/config";
import { CHERNARUS_MARKERS } from "@/data/maps/chernarus/markers";
import { CHERNARUS_CATEGORIES } from "@/data/maps/chernarus/categories";

/**
 * Registry of all map engine configurations.
 * To add a new map: import its config and add a key here.
 * No component needs to change.
 */
const MAP_REGISTRY: Record<string, MapEngineConfig> = {
  chernarus: chernarusConfig,
};

/**
 * Registry of markers keyed by map slug.
 */
const MARKERS_REGISTRY: Record<string, Marker[]> = {
  chernarus: CHERNARUS_MARKERS,
};

/**
 * Registry of marker categories keyed by map slug.
 */
const CATEGORIES_REGISTRY: Record<string, MarkerCategory[]> = {
  chernarus: CHERNARUS_CATEGORIES,
};

/** Returns the engine config for a given map slug, or null if not found. */
export function getMapConfig(slug: string): MapEngineConfig | null {
  return MAP_REGISTRY[slug] ?? null;
}

/** Returns all markers for a given map slug, or an empty array. */
export function getMarkers(slug: string): Marker[] {
  return MARKERS_REGISTRY[slug] ?? [];
}

/** Returns all marker categories for a given map slug, or an empty array. */
export function getCategories(slug: string): MarkerCategory[] {
  return CATEGORIES_REGISTRY[slug] ?? [];
}
