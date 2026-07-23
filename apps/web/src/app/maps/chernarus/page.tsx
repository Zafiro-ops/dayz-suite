import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import MapLoader from "@/components/map/MapLoader";

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

        <MapLoader mapSlug="chernarus" />
      </Container>
    </div>
  );
}
