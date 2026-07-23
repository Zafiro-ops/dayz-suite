"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

interface MapContextValue {
  selectedMarkerId: string | null;
  handleSelectMarker: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  enabledCategories: Set<string>;
  toggleCategory: (id: string) => void;
  enableAllCategories: () => void;
  disableAllCategories: () => void;
}

const MapContext = createContext<MapContextValue | null>(null);

interface MapProviderProps {
  children: ReactNode;
  initialCategoryIds: string[];
}

export function MapProvider({ children, initialCategoryIds }: MapProviderProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    () => new Set(initialCategoryIds),
  );

  // Stable ref so enable-all can reference the full id list without
  // including initialCategoryIds in callback dependency arrays.
  const allCategoryIdsRef = useRef(initialCategoryIds);

  const handleSelectMarker = useCallback((id: string | null) => {
    setSelectedMarkerId((prev) => (prev === id ? null : id));
  }, []);

  const toggleCategory = useCallback((id: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const enableAllCategories = useCallback(() => {
    setEnabledCategories(new Set(allCategoryIdsRef.current));
  }, []);

  const disableAllCategories = useCallback(() => {
    setEnabledCategories(new Set());
  }, []);

  const value = useMemo(
    () => ({
      selectedMarkerId,
      handleSelectMarker,
      searchQuery,
      setSearchQuery,
      enabledCategories,
      toggleCategory,
      enableAllCategories,
      disableAllCategories,
    }),
    [
      selectedMarkerId,
      handleSelectMarker,
      searchQuery,
      enabledCategories,
      toggleCategory,
      enableAllCategories,
      disableAllCategories,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext(): MapContextValue {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMapContext must be used inside MapProvider");
  return ctx;
}
