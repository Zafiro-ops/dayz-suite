import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import MapPlaceholder from "@/components/MapPlaceholder";

export const metadata: Metadata = {
  title: "Chernarus Interactive Map",
  description:
    "Explore the Chernarus DayZ map. Find towns, military bases, loot locations, and points of interest across 225 km² of post-Soviet landscape.",
};

export default function ChernarusPage() {
  return (
    <div className="py-8">
      <Container>
        <div className="mb-5">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            Chernarus Interactive Map
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            The original DayZ map — 225 km² of post-Soviet landscape spanning
            coastal towns, dense forests, military installations, and rural
            villages.
          </p>
        </div>

        <div
          className="mb-3 flex flex-wrap items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900 px-4 py-3"
          role="toolbar"
          aria-label="Map controls — coming in the next milestone"
        >
          <span className="mr-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
            Next milestone:
          </span>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-sm border border-zinc-800 px-3 py-1.5 text-xs text-zinc-600"
          >
            Search locations
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-sm border border-zinc-800 px-3 py-1.5 text-xs text-zinc-600"
          >
            Filters
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="cursor-not-allowed rounded-sm border border-zinc-800 px-3 py-1.5 text-xs text-zinc-600"
          >
            Map layers
          </button>
        </div>

        <MapPlaceholder />
      </Container>
    </div>
  );
}
