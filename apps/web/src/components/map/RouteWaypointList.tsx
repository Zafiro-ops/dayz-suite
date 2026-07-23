"use client";

import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import { calcSegmentDistance } from "@/lib/map-engine/route-utils";

const START_COLOR = "#22c55e";
const END_COLOR = "#ef4444";
const MID_COLOR = "#f59e0b";

export default function RouteWaypointList() {
  const { points, removePoint } = useRoutePlannerContext();

  if (points.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Route waypoints"
      className="mt-3 rounded-sm border border-zinc-800 bg-zinc-900"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <h3 className="text-xs font-medium text-zinc-400">
          Waypoints
          <span className="ml-1.5 font-normal text-zinc-600">
            ({points.length})
          </span>
        </h3>
      </div>

      {/* Scrollable list */}
      <ul
        aria-label="Route waypoint list"
        className="max-h-64 divide-y divide-zinc-800/50 overflow-y-auto"
      >
        {points.map((point, i) => {
          const isStart = i === 0;
          const isEnd = i === points.length - 1 && points.length > 1;
          const num = i + 1;
          const dotColor = isStart ? START_COLOR : isEnd ? END_COLOR : MID_COLOR;
          const segDist =
            i > 0 ? calcSegmentDistance(points[i - 1], point) : null;

          const removeLabel = `Remove waypoint ${num}${isStart ? " — Start" : isEnd ? " — End" : ""}`;

          return (
            <li
              key={point.id}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              {/* Numbered badge */}
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              >
                {num}
              </span>

              {/* Start / End text label — not communicated by color alone */}
              {(isStart || isEnd) ? (
                <span
                  className="shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: dotColor, border: `1px solid ${dotColor}33` }}
                >
                  {isStart ? "Start" : "End"}
                </span>
              ) : (
                <span className="w-9 shrink-0" aria-hidden="true" />
              )}

              {/* Coordinates */}
              <span className="flex-1 font-mono text-[11px] text-zinc-400">
                {point.x.toFixed(1)},&nbsp;{point.y.toFixed(1)}
              </span>

              {/* Segment distance (all but first) */}
              <span className="shrink-0 text-[11px] text-zinc-600" aria-label={segDist !== null ? `${segDist.toFixed(1)} map units from previous` : ""}>
                {segDist !== null ? `+${segDist.toFixed(1)}` : ""}
              </span>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removePoint(point.id)}
                aria-label={removeLabel}
                className="shrink-0 rounded-sm border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
