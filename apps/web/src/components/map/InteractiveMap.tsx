"use client";

import { getMapConfig, getMarkers, getCategories } from "@/lib/map-engine/registry";
import { MapProvider, useMapContext } from "@/lib/map-engine/context";
import { RoutePlannerProvider, useRoutePlannerContext } from "@/lib/map-engine/route-context";
import { useFilteredMarkers } from "@/lib/map-engine/hooks";
import type { MapEngineConfig } from "@/types/map-engine";
import type { Marker, MarkerCategory } from "@/types/marker";
import MapViewport from "./MapViewport";
import MapToolbar from "./MapToolbar";
import MarkerDetailPanel from "./MarkerDetailPanel";
import RoutePlannerBar from "./RoutePlannerBar";
import RouteWaypointList from "./RouteWaypointList";

interface InteractiveMapProps {
  mapSlug: string;
}

interface InnerProps {
  config: MapEngineConfig;
  markers: Marker[];
  categories: MarkerCategory[];
}

function InteractiveMapInner({ config, markers, categories }: InnerProps) {
  const {
    selectedMarkerId,
    handleSelectMarker,
    searchQuery,
    enabledCategories,
  } = useMapContext();
  const { isActive: isRouteActive, points: routePoints } =
    useRoutePlannerContext();

  const filteredMarkers = useFilteredMarkers(
    markers,
    enabledCategories,
    searchQuery,
  );

  const selectedMarker =
    selectedMarkerId !== null
      ? (markers.find((m) => m.id === selectedMarkerId) ?? null)
      : null;

  const selectedCategory =
    selectedMarker !== null
      ? (categories.find((c) => c.id === selectedMarker.category) ?? null)
      : null;

  return (
    <div>
      <MapToolbar categories={categories} />
      {isRouteActive && <RoutePlannerBar />}
      <div
        className="w-full aspect-video overflow-hidden rounded-sm border border-zinc-800"
        role="application"
        aria-label={`${config.name} interactive map`}
      >
        <MapViewport
          config={config}
          markers={filteredMarkers}
          categories={categories}
          selectedMarkerId={selectedMarkerId}
          onSelectMarker={handleSelectMarker}
        />
      </div>
      {selectedMarker !== null && selectedCategory !== null && (
        <MarkerDetailPanel
          marker={selectedMarker}
          category={selectedCategory}
          onClose={() => handleSelectMarker(null)}
        />
      )}
      {routePoints.length > 0 && <RouteWaypointList />}
    </div>
  );
}

export default function InteractiveMap({ mapSlug }: InteractiveMapProps) {
  const config = getMapConfig(mapSlug);
  const markers = getMarkers(mapSlug);
  const categories = getCategories(mapSlug);

  if (!config) {
    return (
      <div
        className="flex w-full aspect-video items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950"
        role="alert"
      >
        <p className="text-xs text-zinc-500">Map not found: {mapSlug}</p>
      </div>
    );
  }

  return (
    <MapProvider initialCategoryIds={categories.map((c) => c.id)}>
      <RoutePlannerProvider>
        <InteractiveMapInner
          config={config}
          markers={markers}
          categories={categories}
        />
      </RoutePlannerProvider>
    </MapProvider>
  );
}
