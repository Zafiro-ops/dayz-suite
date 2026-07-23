import type { MapEngineConfig } from "@/types/map-engine";

/**
 * Engine configuration for the fictional Chernarus map canvas.
 * Bounds and zoom values reflect the fictional 1000×1000 grid used
 * during the MVP. These values will be replaced when real licensed
 * terrain assets are integrated (see MAP_DATA_SOURCE.md).
 */
export const chernarusConfig: MapEngineConfig = {
  slug: "chernarus",
  name: "Chernarus",
  status: "available",
  description:
    "The original DayZ map — 225 km² of post-Soviet landscape spanning forests, coastal towns, and military installations.",
  bounds: {
    width: 1000,
    height: 1000,
    leafletBounds: [
      [0, 0],
      [1000, 1000],
    ],
  },
  zoom: {
    min: 0,
    max: 4,
    default: 1,
    wheelStep: 0.5,
  },
  defaultCenter: [50, 50],
};
