"use client";

import { useState, useRef, useEffect } from "react";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";

export default function RouteManagerPanel() {
  const {
    routes,
    activeRouteId,
    createRoute,
    renameRoute,
    switchRoute,
    duplicateRoute,
    deleteRoute,
  } = useRoutePlannerContext();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (clearRef.current) clearTimeout(clearRef.current);
    },
    [],
  );

  function announce(msg: string) {
    setAnnouncement(msg);
    if (clearRef.current) clearTimeout(clearRef.current);
    clearRef.current = setTimeout(() => setAnnouncement(""), 2000);
  }

  function startEditing(id: string, currentName: string) {
    setEditingId(id);
    setDraftName(currentName);
  }

  function commitEditing() {
    if (editingId) {
      const name = draftName.trim() || "Unnamed Route";
      renameRoute(editingId, name);
      announce(`Route renamed to "${name}".`);
    }
    setEditingId(null);
    setDraftName("");
  }

  function cancelEditing() {
    setEditingId(null);
    setDraftName("");
  }

  return (
    <div
      role="region"
      aria-label="Route manager"
      className="mt-3 rounded-sm border border-zinc-800 bg-zinc-900"
    >
      {/* Screen-reader live announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <h3 className="text-xs font-medium text-zinc-400">
          Routes
          <span className="ml-1.5 font-normal text-zinc-600">
            ({routes.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={() => {
            createRoute();
            announce("New route created.");
          }}
          aria-label="Create new route"
          className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          + New Route
        </button>
      </div>

      {/* Route list */}
      <ul
        aria-label="Route list"
        className="max-h-64 divide-y divide-zinc-800/50 overflow-y-auto"
      >
        {routes.map((route) => {
          const isActiveRoute = route.id === activeRouteId;
          const isEditing = editingId === route.id;

          return (
            <li
              key={route.id}
              className={`flex items-center gap-2 px-4 py-2 ${
                isActiveRoute ? "bg-amber-500/5" : ""
              }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={draftName}
                  autoFocus
                  maxLength={80}
                  onChange={(e) => setDraftName(e.target.value)}
                  onBlur={commitEditing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEditing();
                    if (e.key === "Escape") cancelEditing();
                  }}
                  aria-label={`Rename route ${route.name}`}
                  className="min-w-0 flex-1 rounded-sm border border-amber-500/60 bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-200 focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    switchRoute(route.id);
                    announce(`"${route.name}" is now the active route.`);
                  }}
                  aria-pressed={isActiveRoute}
                  aria-label={
                    isActiveRoute
                      ? `${route.name} — active route`
                      : `Select ${route.name} as the active route`
                  }
                  className="flex min-w-0 flex-1 items-center gap-2 truncate rounded-sm py-0.5 text-left text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isActiveRoute ? "bg-amber-500" : "bg-zinc-600"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`truncate ${
                      isActiveRoute ? "text-amber-400" : "text-zinc-300"
                    }`}
                  >
                    {route.name}
                  </span>
                </button>
              )}

              {/* Point count */}
              <span className="shrink-0 text-[11px] text-zinc-600">
                {route.points.length} {route.points.length === 1 ? "pt" : "pts"}
              </span>

              {/* Rename */}
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => startEditing(route.id, route.name)}
                  aria-label={`Rename ${route.name}`}
                  className="shrink-0 rounded-sm border border-zinc-700 px-1.5 py-0.5 text-[11px] text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Rename
                </button>
              )}

              {/* Duplicate */}
              <button
                type="button"
                onClick={() => {
                  duplicateRoute(route.id);
                  announce(`"${route.name}" duplicated.`);
                }}
                aria-label={`Duplicate ${route.name}`}
                className="shrink-0 rounded-sm border border-zinc-700 px-1.5 py-0.5 text-[11px] text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Duplicate
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  deleteRoute(route.id);
                  announce(`"${route.name}" deleted.`);
                }}
                disabled={routes.length === 1}
                aria-label={`Delete ${route.name}`}
                className="shrink-0 rounded-sm border border-zinc-700 px-1.5 py-0.5 text-[11px] text-zinc-500 transition-colors hover:border-red-800 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
