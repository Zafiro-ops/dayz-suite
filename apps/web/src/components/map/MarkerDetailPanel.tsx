"use client";

import { useEffect, useRef, useState } from "react";
import type { Marker, MarkerCategory } from "@/types/marker";

interface MarkerDetailPanelProps {
  marker: Marker;
  category: MarkerCategory;
  onClose: () => void;
}

interface LevelPipsProps {
  level: number;
  label: string;
  color: "amber" | "red";
}

function LevelPips({ level, label, color }: LevelPipsProps) {
  const filledClass =
    color === "red" ? "bg-red-500" : "bg-amber-500";
  return (
    <span
      className="flex items-center gap-1"
      aria-label={`${label}: ${level} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i < level ? filledClass : "bg-zinc-700"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function MarkerDetailPanel({
  marker,
  category,
  onClose,
}: MarkerDetailPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // Focus the close button whenever the panel opens or the marker changes
  useEffect(() => {
    closeRef.current?.focus();
  }, [marker.id]);

  // Escape key closes the panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleCopy = () => {
    const text = `${marker.x.toFixed(1)}, ${marker.y.toFixed(1)}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // clipboard unavailable in this context — silent fail
    });
  };

  return (
    <div
      role="dialog"
      aria-labelledby="mdp-name"
      aria-describedby="mdp-desc"
      className="mt-2 rounded-sm border border-zinc-800 bg-zinc-900"
    >
      {/* Header row — category label + close button */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: category.color }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium" style={{ color: category.color }}>
            {category.label}
          </span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close marker details"
          className="rounded-sm p-0.5 text-zinc-500 hover:text-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="space-y-4 px-4 py-4">
        {/* Name + short description */}
        <div>
          <h2 id="mdp-name" className="text-base font-semibold text-white">
            {marker.name}
          </h2>
          <p
            id="mdp-desc"
            className="mt-1 text-xs leading-relaxed text-zinc-400"
          >
            {marker.shortDescription}
          </p>
        </div>

        {/* Data rows */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-xs">
          <dt className="self-center text-zinc-500">Coordinates</dt>
          <dd className="flex items-center gap-2">
            <span className="font-mono text-zinc-300">
              {marker.x.toFixed(1)},&nbsp;{marker.y.toFixed(1)}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Coordinates copied" : "Copy coordinates"}
              className="rounded-sm border border-zinc-700 px-2 py-0.5 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </dd>

          <dt className="self-center text-zinc-500">Loot</dt>
          <dd className="flex items-center">
            <LevelPips
              level={marker.lootLevel}
              label="Loot level"
              color="amber"
            />
          </dd>

          <dt className="self-center text-zinc-500">Danger</dt>
          <dd className="flex items-center">
            <LevelPips
              level={marker.dangerLevel}
              label="Danger level"
              color="red"
            />
          </dd>
        </dl>
      </div>
    </div>
  );
}
