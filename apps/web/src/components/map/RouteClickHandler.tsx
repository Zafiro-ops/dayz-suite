"use client";

import { useEffect } from "react";
import { useMapEvents } from "react-leaflet";
import { leafletToNormalized, clampNormalized } from "@/lib/map-engine/coordinates";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import type { MapBounds } from "@/types/map-engine";

interface RouteClickHandlerProps {
  bounds: MapBounds;
}

export default function RouteClickHandler({ bounds }: RouteClickHandlerProps) {
  const { isActive, addPoint } = useRoutePlannerContext();

  const map = useMapEvents({
    click(e) {
      if (!isActive) return;
      const [x, y] = leafletToNormalized(e.latlng.lat, e.latlng.lng, bounds);
      addPoint(clampNormalized(x), clampNormalized(y));
    },
  });

  // Switch to crosshair cursor while route mode is active
  useEffect(() => {
    const container = map.getContainer();
    container.style.cursor = isActive ? "crosshair" : "";
    return () => {
      container.style.cursor = "";
    };
  }, [isActive, map]);

  return null;
}
