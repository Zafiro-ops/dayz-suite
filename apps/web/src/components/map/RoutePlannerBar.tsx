"use client";

import { useRoutePlannerContext } from "@/lib/map-engine/route-context";

export default function RoutePlannerBar() {
  const { points, totalDistance, undoLastPoint, clearRoute, exitRoute } =
    useRoutePlannerContext();

  const hasPoints = points.length > 0;

  return (
    <div
      role="region"
      aria-label="Route planner controls"
      className="mb-3 rounded-sm border border-amber-500/30 bg-zinc-900"
    >
      {/* Status row — mode indicator, point count, distance */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-amber-500"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-amber-400">
            Route Mode Active
          </span>
          {hasPoints && (
            <>
              <span className="text-xs text-zinc-600" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-zinc-500">
                {points.length} {points.length === 1 ? "point" : "points"}
              </span>
            </>
          )}
        </div>

        {points.length >= 2 && (
          <output
            aria-live="polite"
            aria-label={`Total route distance: ${totalDistance.toFixed(1)} map units`}
            className="text-xs text-zinc-400"
          >
            Distance:{" "}
            <span className="font-mono text-zinc-200">
              {totalDistance.toFixed(1)}
            </span>{" "}
            <span className="text-zinc-600">map units</span>
          </output>
        )}
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5">
        {!hasPoints && (
          <p className="mr-2 text-xs text-zinc-600" aria-live="polite">
            Click the map to add route points.
          </p>
        )}

        <button
          type="button"
          onClick={undoLastPoint}
          disabled={!hasPoints}
          aria-label="Undo last route point"
          className="rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Undo Last Point
        </button>

        <button
          type="button"
          onClick={clearRoute}
          disabled={!hasPoints}
          aria-label="Clear all route points"
          className="rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear Route
        </button>

        <button
          type="button"
          onClick={exitRoute}
          aria-label="Exit route planning mode"
          className="ml-auto rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Exit Route Mode
        </button>
      </div>
    </div>
  );
}
