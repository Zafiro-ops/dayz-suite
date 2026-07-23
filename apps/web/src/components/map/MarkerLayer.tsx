"use client";

import { useMemo } from "react";
import type { Marker, MarkerCategory } from "@/types/marker";
import type { MapBounds } from "@/types/map-engine";
import MapMarker from "./MapMarker";

interface MarkerLayerProps {
  markers: Marker[];
  categories: MarkerCategory[];
  selectedMarkerId: string | null;
  onSelectMarker: (id: string | null) => void;
  bounds: MapBounds;
}

const FALLBACK_CATEGORY: MarkerCategory = {
  id: "unknown",
  label: "Unknown",
  color: "#71717a",
};

export default function MarkerLayer({
  markers,
  categories,
  selectedMarkerId,
  onSelectMarker,
  bounds,
}: MarkerLayerProps) {
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  return (
    <>
      {markers.map((marker) => (
        <MapMarker
          key={marker.id}
          marker={marker}
          category={categoryMap.get(marker.category) ?? FALLBACK_CATEGORY}
          isSelected={selectedMarkerId === marker.id}
          onSelect={onSelectMarker}
          bounds={bounds}
        />
      ))}
    </>
  );
}
