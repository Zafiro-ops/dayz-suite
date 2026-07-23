import { useMemo } from "react";
import type { Marker } from "@/types/marker";

export function useFilteredMarkers(
  markers: Marker[],
  enabledCategories: Set<string>,
  searchQuery: string,
): Marker[] {
  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return markers.filter((m) => {
      if (!enabledCategories.has(m.category)) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.shortDescription.toLowerCase().includes(q) ||
        m.searchTerms.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [markers, enabledCategories, searchQuery]);
}
