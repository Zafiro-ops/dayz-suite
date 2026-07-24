"use client";

import { useRef, useState, useEffect } from "react";
import { useRoutePlannerContext } from "@/lib/map-engine/route-context";
import {
  serializeRoute,
  parseRouteFile,
} from "@/lib/map-engine/route-document";

interface RouteFileActionsProps {
  mapSlug: string;
}

interface Feedback {
  type: "status" | "alert";
  message: string;
}

export default function RouteFileActions({ mapSlug }: RouteFileActionsProps) {
  const { points, routeName, setRouteName, importRoute } =
    useRoutePlannerContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(
    () => () => {
      if (clearRef.current) clearTimeout(clearRef.current);
    },
    [],
  );

  function showFeedback(type: Feedback["type"], message: string) {
    if (clearRef.current) clearTimeout(clearRef.current);
    setFeedback({ type, message });
    clearRef.current = setTimeout(() => setFeedback(null), 4000);
  }

  function handleExport() {
    const doc = serializeRoute(mapSlug, routeName, points);
    const json = JSON.stringify(doc, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName =
      routeName.trim().replace(/[^a-z0-9_\- ]/gi, "_").trim() || "route";
    a.href = url;
    a.download = `${safeName}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback("status", "Route exported.");
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so the same file can be re-imported
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = parseRouteFile(reader.result as string, file.size);
      if (!result.ok) {
        showFeedback("alert", result.error);
        return;
      }
      const doc = result.data;
      importRoute(doc.points, doc.routeName);
      showFeedback(
        "status",
        `"${doc.routeName}" imported — ${doc.points.length} waypoint${doc.points.length !== 1 ? "s" : ""}.`,
      );
    };
    reader.onerror = () => {
      showFeedback("alert", "Failed to read file.");
    };
    reader.readAsText(file);
  }

  return (
    <div
      role="region"
      aria-label="Route file actions"
      className="mt-3 rounded-sm border border-zinc-800 bg-zinc-900"
    >
      {/* Always-present live regions — must exist before feedback changes */}
      <div role="status" aria-live="polite" className="sr-only">
        {feedback?.type === "status" ? feedback.message : ""}
      </div>
      <div role="alert" aria-live="assertive" className="sr-only">
        {feedback?.type === "alert" ? feedback.message : ""}
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        {/* Route name field */}
        <label className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-xs text-zinc-500">Route name</span>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Unnamed Route"
            maxLength={80}
            className="min-w-0 flex-1 rounded-sm border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:border-amber-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          />
        </label>

        {/* Export */}
        <button
          type="button"
          onClick={handleExport}
          disabled={points.length === 0}
          aria-label="Export route as JSON file"
          className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export Route
        </button>

        {/* Import */}
        <button
          type="button"
          onClick={handleImportClick}
          aria-label="Import route from JSON file"
          className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Import Route
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
          className="sr-only"
        />
      </div>

      {/* Visible inline feedback — decorative; live regions handle SR announcement */}
      {feedback && (
        <div
          aria-hidden="true"
          className={`border-t border-zinc-800 px-4 py-2 text-xs ${
            feedback.type === "alert" ? "text-red-400" : "text-green-400"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
