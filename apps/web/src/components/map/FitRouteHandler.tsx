"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import type { MapBounds } from "@/types/map-engine";
import type { RoutePoint } from "@/types/route";

interface FitRouteHandlerProps {
  bounds: MapBounds;
}

export default function FitRouteHandler({ bounds }: FitRouteHandlerProps) {
  const { points, fitRouteTrigger } = useRoutePlannerContext();
  const map = useMap();

  // Updated during render so the effect always reads the latest points
  // without needing points in the dependency array (avoids redundant fitBounds
  // calls whenever the point list changes for reasons other than a fit request).
  const pointsRef = useRef<RoutePoint[]>(points);
  pointsRef.current = points;

  useEffect(() => {
    if (fitRouteTrigger === 0 || pointsRef.current.length < 2) return;
    const latLngs = pointsRef.current.map((p) =>
      normalizedToLeaflet(p.x, p.y, bounds),
    );
    map.fitBounds(L.latLngBounds(latLngs as L.LatLngExpression[]), {
      padding: [40, 40],
    });
  }, [fitRouteTrigger, bounds, map]);

  return null;
}
