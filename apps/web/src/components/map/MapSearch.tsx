"use client";

import { useState, useEffect, useRef } from "react";
import { useMapContext } from "@/lib/map-engine/context";

export default function MapSearch() {
  const { setSearchQuery } = useMapContext();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(inputValue), 200);
    return () => clearTimeout(id);
  }, [inputValue, setSearchQuery]);

  const clear = () => {
    setInputValue("");
    setSearchQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center">
      <label htmlFor="map-search" className="sr-only">
        Search locations
      </label>
      <input
        ref={inputRef}
        id="map-search"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") clear();
        }}
        placeholder="Search locations…"
        autoComplete="off"
        className="w-44 rounded-sm border border-zinc-700 bg-zinc-950 py-1.5 pl-3 pr-7 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus-visible:border-zinc-600 focus-visible:ring-2 focus-visible:ring-amber-500"
      />
      {inputValue && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-sm text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          ✕
        </button>
      )}
    </div>
  );
}
