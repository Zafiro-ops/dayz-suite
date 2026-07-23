"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("@/components/map/InteractiveMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full aspect-video items-center justify-center rounded-sm border border-zinc-800 bg-zinc-950">
        <span className="text-xs text-zinc-500">Loading map…</span>
      </div>
    ),
  },
);

export default function MapLoader({ mapSlug }: { mapSlug: string }) {
  return <InteractiveMap mapSlug={mapSlug} />;
}
