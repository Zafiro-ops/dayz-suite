"use client";

import { useEffect, useRef } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import type { CircleMarker as LCircleMarker } from "leaflet";
import type { Marker, MarkerCategory } from "@/types/marker";
import type { MapBounds } from "@/types/map-engine";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";

interface MapMarkerProps {
  marker: Marker;
  category: MarkerCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
  bounds: MapBounds;
}

export default function MapMarker({
  marker,
  category,
  isSelected,
  onSelect,
  bounds,
}: MapMarkerProps) {
  const layerRef = useRef<LCircleMarker>(null);
  const center = normalizedToLeaflet(marker.x, marker.y, bounds);

  useEffect(() => {
    const el = layerRef.current?.getElement() as HTMLElement | undefined;
    if (!el) return;

    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.setAttribute(
      "aria-label",
      `${marker.name} — ${category.label}${isSelected ? " (selected)" : ""}`,
    );
    el.setAttribute("aria-pressed", String(isSelected));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(marker.id);
      }
    };
    el.addEventListener("keydown", handleKey);
    return () => el.removeEventListener("keydown", handleKey);
  }, [marker.id, marker.name, category.label, isSelected, onSelect]);

  return (
    <CircleMarker
      ref={layerRef}
      center={center}
      radius={isSelected ? 10 : 7}
      pathOptions={{
        color: isSelected ? "#ffffff" : category.color,
        fillColor: category.color,
        fillOpacity: isSelected ? 1 : 0.75,
        weight: isSelected ? 3 : 1.5,
      }}
      eventHandlers={{ click: () => onSelect(marker.id) }}
    >
      <Tooltip direction="top" offset={[0, -10]}>
        <span style={{ fontWeight: 600, fontSize: "12px" }}>{marker.name}</span>
        <br />
        <span style={{ fontSize: "11px", color: category.color }}>
          {category.label}
        </span>
      </Tooltip>
    </CircleMarker>
  );
}
