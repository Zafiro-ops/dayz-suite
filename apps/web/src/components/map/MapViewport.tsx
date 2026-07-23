"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet";
import { CRS } from "leaflet";
import type { MapEngineConfig } from "@/types/map-engine";
import type { Marker, MarkerCategory } from "@/types/marker";
import NeutralMapBackground from "./NeutralMapBackground";
import ClusterLayer from "./ClusterLayer";
import RouteMapLayer from "./RouteMapLayer";
import RouteClickHandler from "./RouteClickHandler";
import FitRouteHandler from "./FitRouteHandler";
import { normalizedToLeaflet } from "@/lib/map-engine/coordinates";

interface MapViewportProps {
  config: MapEngineConfig;
  markers: Marker[];
  categories: MarkerCategory[];
  selectedMarkerId: string | null;
  onSelectMarker: (id: string | null) => void;
}

export default function MapViewport({
  config,
  markers,
  categories,
  selectedMarkerId,
  onSelectMarker,
}: MapViewportProps) {
  const center = normalizedToLeaflet(
    config.defaultCenter[0],
    config.defaultCenter[1],
    config.bounds,
  );

  return (
    <MapContainer
      crs={CRS.Simple}
      center={center}
      zoom={config.zoom.default}
      minZoom={config.zoom.min}
      maxZoom={config.zoom.max}
      maxBounds={config.bounds.leafletBounds}
      maxBoundsViscosity={1.0}
      attributionControl={false}
      zoomControl
      style={{ width: "100%", height: "100%", background: "#09090b" }}
    >
      <NeutralMapBackground bounds={config.bounds.leafletBounds} />
      <ClusterLayer
        markers={markers}
        categories={categories}
        selectedMarkerId={selectedMarkerId}
        onSelectMarker={onSelectMarker}
        bounds={config.bounds}
      />
      <RouteMapLayer bounds={config.bounds} />
      <RouteClickHandler bounds={config.bounds} />
      <FitRouteHandler bounds={config.bounds} />
    </MapContainer>
  );
}
