"use client";

import { Polyline, CircleMarker } from "react-leaflet";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import type { MapBounds } from "@/types/map-engine";

interface RouteMapLayerProps {
  bounds: MapBounds;
}

const START_COLOR = "#22c55e";
const END_COLOR = "#ef4444";
const MID_COLOR = "#f59e0b";

export default function RouteMapLayer({ bounds }: RouteMapLayerProps) {
  const { points } = useRoutePlannerContext();

  if (points.length === 0) return null;

  const positions = points.map((p) => normalizedToLeaflet(p.x, p.y, bounds));

  return (
    <>
      {points.length > 1 && (
        <Polyline
          positions={positions}
          pathOptions={{
            color: MID_COLOR,
            weight: 2,
            opacity: 0.85,
            dashArray: "6 4",
          }}
        />
      )}
      {points.map((point, i) => {
        const isStart = i === 0;
        const isEnd = i === points.length - 1 && points.length > 1;
        const color = isStart ? START_COLOR : isEnd ? END_COLOR : MID_COLOR;
        const radius = isStart ? 8 : 6;

        return (
          <CircleMarker
            key={point.id}
            center={normalizedToLeaflet(point.x, point.y, bounds)}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.9,
              color: "#ffffff",
              weight: 2,
            }}
          />
        );
      })}
    </>
  );
}
