import type { MapDefinition } from "@/types/map";

export const MAPS: MapDefinition[] = [
  {
    slug: "chernarus",
    name: "Chernarus",
    status: "available",
    description:
      "The original DayZ map — 225 km² of post-Soviet landscape spanning forests, coastal towns, and military installations.",
  },
  {
    slug: "livonia",
    name: "Livonia",
    status: "coming-soon",
    description:
      "A dense Central European forest environment with distinct seasons and varied terrain.",
  },
  {
    slug: "sakhal",
    name: "Sakhal",
    status: "coming-soon",
    description:
      "A remote volcanic island in the Northern Pacific — harsh, unforgiving, and unlike anything else in DayZ.",
  },
];
