import type { Metadata } from "next";
import type { ReactNode } from "react";
import ButtonLink from "@/components/ui/ButtonLink";
import Container from "@/components/ui/Container";
import FeatureCard from "@/components/ui/FeatureCard";
import MapCard from "@/components/ui/MapCard";
import MapPlaceholder from "@/components/MapPlaceholder";
import { MAPS } from "@/lib/maps";

export const metadata: Metadata = {
  title: {
    absolute: "DAYZ SUITE — Interactive DayZ Maps",
  },
  description:
    "Fast, detailed, and interactive maps for DayZ. Search locations, plan routes, and explore every map environment — free and without an account.",
};

interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "Fast interactive navigation",
    description:
      "Pan and zoom across the full map without page reloads. Designed for quick in-game lookups.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    title: "Searchable locations",
    description:
      "Find towns, military bases, and points of interest instantly by name.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Mobile-friendly exploration",
    description:
      "Optimised for touch screens. Use the map from your phone while you play.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-zinc-800 py-20 sm:py-28">
        <Container>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-amber-400">
            Interactive maps for DayZ survivors
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore DayZ
            <br />
            with confidence
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-zinc-400">
            Fast, detailed, and interactive maps for every DayZ environment.
            Search for locations, plan your route, and find what you need to
            survive — no account required.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/maps/chernarus" variant="primary">
              Explore Chernarus
            </ButtonLink>
            <ButtonLink href="/maps" variant="secondary">
              View all maps
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Map preview */}
      <section className="border-b border-zinc-800 py-14">
        <Container>
          <MapPlaceholder />
        </Container>
      </section>

      {/* Features */}
      <section className="border-b border-zinc-800 py-16">
        <Container>
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-white">
            Built for every survivor
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </Container>
      </section>

      {/* Available maps */}
      <section className="border-b border-zinc-800 py-16">
        <Container>
          <h2 className="mb-10 text-2xl font-bold tracking-tight text-white">
            Available maps
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MAPS.map((map) => (
              <MapCard key={map.slug} {...map} />
            ))}
          </div>
        </Container>
      </section>

      {/* Support placeholder */}
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-xl rounded-sm border border-zinc-800 bg-zinc-900 p-8 text-center sm:p-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Community project
            </p>
            <h2 className="mb-3 text-xl font-semibold text-zinc-100">
              Support DAYZ SUITE
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              DAYZ SUITE is free and independent. Optional support helps keep
              the maps updated and the servers running.
            </p>
            <span className="inline-block cursor-not-allowed rounded-sm border border-zinc-700 px-5 py-2.5 text-sm text-zinc-600">
              Support link coming soon
            </span>
          </div>
        </Container>
      </section>
    </>
  );
}
