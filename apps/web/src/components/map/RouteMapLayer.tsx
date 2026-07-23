"use client";

import L from "leaflet";
import { Polyline, Marker } from "react-leaflet";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import type { MapBounds } from "@/types/map-engine";

interface RouteMapLayerProps {
  bounds: MapBounds;
}

const START_COLOR = "#22c55e";
const END_COLOR = "#ef4444";
const MID_COLOR = "#f59e0b";
const LINE_COLOR = "#f59e0b";

function makeWaypointIcon(
  num: number,
  isStart: boolean,
  isEnd: boolean,
): L.DivIcon {
  const color = isStart ? START_COLOR : isEnd ? END_COLOR : MID_COLOR;
  const size = isStart || isEnd ? 24 : 20;
  const half = size / 2;
  const fontSize = size <= 20 ? "9" : "10";
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #ffffff;display:flex;align-items:center;justify-content:center;font-size:${fontSize}px;font-weight:700;font-family:system-ui,sans-serif;color:#ffffff;box-sizing:border-box;">${num}</div>`,
    className: "",
    iconSize: L.point(size, size),
    iconAnchor: L.point(half, half),
  });
}

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
            color: LINE_COLOR,
            weight: 2,
            opacity: 0.85,
            dashArray: "6 4",
          }}
        />
      )}
      {points.map((point, i) => {
        const isStart = i === 0;
        const isEnd = i === points.length - 1 && points.length > 1;
        const num = i + 1;
        const label = isStart
          ? `Waypoint ${num} — Start`
          : isEnd
            ? `Waypoint ${num} — End`
            : `Waypoint ${num}`;

        return (
          <Marker
            key={point.id}
            position={normalizedToLeaflet(point.x, point.y, bounds)}
            icon={makeWaypointIcon(num, isStart, isEnd)}
            alt={label}
            title={label}
          />
        );
      })}
    </>
  );
}
