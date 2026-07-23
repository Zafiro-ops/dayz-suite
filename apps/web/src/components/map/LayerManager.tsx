"use client";

import { useState, useMemo } from "react";
import { useMapContext } from "@/lib/map-engine/context";
import type { MarkerCategory } from "@/types/marker";

interface LayerManagerProps {
  id: string;
  categories: MarkerCategory[];
}

export default function LayerManager({ id, categories }: LayerManagerProps) {
  const {
    enabledCategories,
    toggleCategory,
    enableAllCategories,
    disableAllCategories,
  } = useMapContext();

  const [search, setSearch] = useState("");

  const visibleCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.label.toLowerCase().includes(q));
  }, [categories, search]);

  const enabledCount = categories.filter((c) =>
    enabledCategories.has(c.id),
  ).length;

  return (
    <div
      id={id}
      role="group"
      aria-label="Layer visibility controls"
      className="rounded-sm border border-zinc-800 bg-zinc-900"
    >
      {/* ── Header: category search + bulk actions ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <label htmlFor="layer-cat-search" className="sr-only">
          Search categories
        </label>
        <input
          id="layer-cat-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSearch("");
          }}
          placeholder="Search layers…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-sm border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        />
        <button
          type="button"
          onClick={enableAllCategories}
          aria-label="Enable all categories"
          className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Enable All
        </button>
        <button
          type="button"
          onClick={disableAllCategories}
          aria-label="Disable all categories"
          className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Disable All
        </button>
      </div>

      {/* ── Visibility summary ── */}
      <p className="px-3 pb-1 pt-2 text-xs text-zinc-600">
        {enabledCount} of {categories.length}{" "}
        {categories.length === 1 ? "layer" : "layers"} visible
      </p>

      {/* ── Scrollable category list ── */}
      <ul
        role="list"
        aria-label="Category layers"
        className="max-h-52 overflow-y-auto px-2 pb-2"
      >
        {visibleCategories.length === 0 ? (
          <li className="px-2 py-3 text-center text-xs text-zinc-600">
            No categories match &ldquo;{search}&rdquo;.
          </li>
        ) : (
          visibleCategories.map((cat) => {
            const isEnabled = enabledCategories.has(cat.id);
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isEnabled}
                  className={`flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 hover:bg-zinc-800 ${
                    isEnabled ? "text-zinc-200" : "text-zinc-500"
                  }`}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: isEnabled ? cat.color : "#52525b",
                    }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{cat.label}</span>
                  {/* Visible on/off indicator — not color-only */}
                  {isEnabled ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className="shrink-0 text-amber-500"
                      aria-hidden="true"
                    >
                      <path
                        d="M1.5 5L4 7.5L8.5 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-sm border border-zinc-700"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
