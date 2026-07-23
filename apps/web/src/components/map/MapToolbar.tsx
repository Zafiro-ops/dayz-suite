"use client";

import { useState } from "react";
import { useMapContext } from "@/lib/map-engine/context";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import type { MarkerCategory } from "@/types/marker";
import MapSearch from "./MapSearch";
import LayerManager from "./LayerManager";

interface MapToolbarProps {
  categories: MarkerCategory[];
}

const LAYER_PANEL_ID = "layer-manager-panel";

export default function MapToolbar({ categories }: MapToolbarProps) {
  const { enabledCategories } = useMapContext();
  const { isActive: isRouteActive, startRoute } = useRoutePlannerContext();
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const enabledCount = categories.filter((c) =>
    enabledCategories.has(c.id),
  ).length;
  const allEnabled = enabledCount === categories.length;

  return (
    <div className="mb-3">
      <div
        role="toolbar"
        aria-label="Map controls"
        className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-sm border border-zinc-800 bg-zinc-900 px-4 py-3"
      >
        <MapSearch />
        <div
          className="hidden h-4 w-px bg-zinc-700 sm:block"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => setIsLayersOpen((v) => !v)}
          aria-expanded={isLayersOpen}
          aria-controls={LAYER_PANEL_ID}
          className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 ${
            isLayersOpen
              ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
          }`}
        >
          {/* Layers icon */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 3h10M1 6h10M1 9h10" />
          </svg>
          Layers
          {/* Badge — shown when at least one category is disabled */}
          {!allEnabled && (
            <span className="text-zinc-500">
              {enabledCount}/{categories.length}
            </span>
          )}
        </button>

        {/* Start Route — hidden while route mode is active */}
        {!isRouteActive && (
          <>
            <div
              className="hidden h-4 w-px bg-zinc-700 sm:block"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={startRoute}
              aria-label="Enter route planning mode"
              className="flex items-center gap-1.5 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="2" cy="10" r="1.5" fill="currentColor" />
                <circle cx="6" cy="4" r="1.5" fill="currentColor" />
                <circle cx="10" cy="8" r="1.5" fill="currentColor" />
                <polyline
                  points="2,10 6,4 10,8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Start Route
            </button>
          </>
        )}
      </div>

      {isLayersOpen && (
        <div className="mt-1">
          <LayerManager id={LAYER_PANEL_ID} categories={categories} />
        </div>
      )}
    </div>
  );
}
