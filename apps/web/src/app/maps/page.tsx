import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import MapCard from "@/components/ui/MapCard";
import { MAPS } from "@/lib/maps";

export const metadata: Metadata = {
  title: "Interactive DayZ Maps",
  description:
    "Browse all available DayZ interactive maps. Explore Chernarus and discover upcoming maps including Livonia and Sakhal.",
};

export default function MapsPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          DayZ Interactive Maps
        </h1>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-zinc-400">
          Detailed, searchable, and interactive maps for every DayZ
          environment. Navigate the world, locate towns and military zones, and
          plan your survival routes without leaving your browser.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MAPS.map((map) => (
            <MapCard key={map.slug} {...map} />
          ))}
        </div>
      </Container>
    </section>
  );
}
