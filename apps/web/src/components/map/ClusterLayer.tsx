"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";
import type { Marker, MarkerCategory } from "@/types/marker";
import type { MapBounds } from "@/types/map-engine";

interface ClusterLayerProps {
  markers: Marker[];
  categories: MarkerCategory[];
  selectedMarkerId: string | null;
  onSelectMarker: (id: string | null) => void;
  bounds: MapBounds;
}

const FALLBACK_COLOR = "#71717a";

function makeMarkerIcon(color: string, selected: boolean): L.DivIcon {
  const size = selected ? 20 : 14;
  const half = size / 2;
  const border = selected ? "3px solid #ffffff" : `1.5px solid ${color}`;
  const opacity = selected ? 1 : 0.75;
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:${border};opacity:${opacity};box-sizing:border-box;"></div>`,
    className: "",
    iconSize: L.point(size, size),
    iconAnchor: L.point(half, half),
  });
}

function makeClusterIcon(count: number): L.DivIcon {
  return L.divIcon({
    html: `<div style="width:36px;height:36px;border-radius:50%;background:rgba(245,158,11,0.15);border:2px solid rgba(245,158,11,0.5);color:#f59e0b;font-size:12px;font-weight:600;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;">${count}</div>`,
    className: "",
    iconSize: L.point(36, 36),
    iconAnchor: L.point(18, 18),
  });
}

export default function ClusterLayer({
  markers,
  categories,
  selectedMarkerId,
  onSelectMarker,
  bounds,
}: ClusterLayerProps) {
  const map = useMap();
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const leafletMarkersRef = useRef(new Map<string, L.Marker>());

  // Mutable refs so effects don't trigger a full cluster rebuild when only
  // the selection or callback identity changes between renders.
  const selectedMarkerIdRef = useRef(selectedMarkerId);
  const onSelectMarkerRef = useRef(onSelectMarker);
  selectedMarkerIdRef.current = selectedMarkerId;
  onSelectMarkerRef.current = onSelectMarker;

  // ── Rebuild cluster group when the visible marker set changes ──────────────
  useEffect(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
    }

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      iconCreateFunction: (cluster) =>
        makeClusterIcon(cluster.getChildCount()),
    });

    const newLeafletMarkers = new Map<string, L.Marker>();

    markers.forEach((marker) => {
      const color = categoryMap.get(marker.category)?.color ?? FALLBACK_COLOR;
      const catLabel = categoryMap.get(marker.category)?.label ?? "";
      const center = normalizedToLeaflet(marker.x, marker.y, bounds);
      const isSelected = marker.id === selectedMarkerIdRef.current;

      const lMarker = L.marker(center, {
        icon: makeMarkerIcon(color, isSelected),
      });

      lMarker.bindTooltip(
        `<strong>${marker.name}</strong><br>${catLabel}`,
        { direction: "top", offset: [0, -8] },
      );

      lMarker.on("click", () => {
        onSelectMarkerRef.current(marker.id);
      });

      clusterGroup.addLayer(lMarker);
      newLeafletMarkers.set(marker.id, lMarker);
    });

    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    leafletMarkersRef.current = newLeafletMarkers;

    return () => {
      map.removeLayer(clusterGroup);
      clusterGroupRef.current = null;
    };
  }, [markers, categories, bounds, map]);

  // ── Update only the two affected marker icons when selection toggles ───────
  // Avoids a full cluster-group rebuild for a simple selection change.
  useEffect(() => {
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const markerMap = new Map(markers.map((m) => [m.id, m]));

    leafletMarkersRef.current.forEach((lMarker, id) => {
      const marker = markerMap.get(id);
      if (!marker) return;
      const color = categoryMap.get(marker.category)?.color ?? FALLBACK_COLOR;
      lMarker.setIcon(makeMarkerIcon(color, id === selectedMarkerId));
    });
  }, [selectedMarkerId, markers, categories]);

  return null;
}
