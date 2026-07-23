import type { MapBounds } from "@/types/map-engine";

/**
 * Leaflet CRS.Simple uses pixel coordinates where [0, 0] is the bottom-left.
 * Our internal coordinate model uses normalized [x, y] in [0, 100] where
 * [0, 0] is the top-left. This module handles the conversion.
 *
 * LeafletCoords is [lat, lng] — matching the order Leaflet expects.
 */
export type LeafletCoords = [number, number];

/**
 * Convert normalized coordinates (0–100) to Leaflet CRS.Simple pixel coords.
 * Flips the Y axis: normalized y=0 (top) → leaflet lat=height (top in CRS.Simple).
 */
export function normalizedToLeaflet(
  x: number,
  y: number,
  bounds: MapBounds
): LeafletCoords {
  const lng = (x / 100) * bounds.width;
  const lat = bounds.height - (y / 100) * bounds.height;
  return [lat, lng];
}

/**
 * Convert Leaflet CRS.Simple pixel coords back to normalized coordinates.
 * Inverse of normalizedToLeaflet.
 */
export function leafletToNormalized(
  lat: number,
  lng: number,
  bounds: MapBounds
): [number, number] {
  const x = (lng / bounds.width) * 100;
  const y = ((bounds.height - lat) / bounds.height) * 100;
  return [x, y];
}

/**
 * Clamp a normalized coordinate to [0, 100].
 * Prevents markers placed slightly out of bounds from disappearing.
 */
export function clampNormalized(value: number): number {
  return Math.min(100, Math.max(0, value));
}
