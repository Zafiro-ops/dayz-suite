import type { MapDefinition } from "./map";

export interface MapBounds {
  /** Logical pixel width of the full map canvas */
  width: number;
  /** Logical pixel height of the full map canvas */
  height: number;
  /**
   * Leaflet LatLngBounds in CRS.Simple pixel coordinates.
   * Format: [[south, west], [north, east]]
   */
  leafletBounds: [[number, number], [number, number]];
}

export interface MapZoomConfig {
  min: number;
  max: number;
  default: number;
  /** Fractional zoom step applied per scroll-wheel tick */
  wheelStep: number;
}

/** Full engine configuration for one map. Consumed by InteractiveMap. */
export interface MapEngineConfig extends MapDefinition {
  bounds: MapBounds;
  zoom: MapZoomConfig;
  /** Default map centre expressed as normalized [x, y] in 0–100 range */
  defaultCenter: [number, number];
}
