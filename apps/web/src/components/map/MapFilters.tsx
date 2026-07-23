"use client";

import { useMapContext } from "@/lib/map-engine/context";
import type { MarkerCategory } from "@/types/marker";

interface MapFiltersProps {
  categories: MarkerCategory[];
}

export default function MapFilters({ categories }: MapFiltersProps) {
  const { enabledCategories, toggleCategory } = useMapContext();

  return (
    <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
      {categories.map((cat) => {
        const isEnabled = enabledCategories.has(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleCategory(cat.id)}
            aria-pressed={isEnabled}
            className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900 ${
              isEnabled
                ? "border-current"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400"
            }`}
            style={isEnabled ? { color: cat.color } : undefined}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: isEnabled ? cat.color : "#52525b" }}
              aria-hidden="true"
            />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
