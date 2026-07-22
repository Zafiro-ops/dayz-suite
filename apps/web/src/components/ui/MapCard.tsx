import Link from "next/link";
import type { MapStatus } from "@/types/map";

interface MapCardProps {
  slug: string;
  name: string;
  status: MapStatus;
  description: string;
}

export default function MapCard({ slug, name, status, description }: MapCardProps) {
  const isAvailable = status === "available";

  const content = (
    <>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-zinc-100">{name}</h3>
        <span
          className={`shrink-0 rounded-sm px-2 py-0.5 text-xs font-medium ${
            isAvailable
              ? "bg-amber-500/10 text-amber-400"
              : "bg-zinc-800 text-zinc-500"
          }`}
        >
          {isAvailable ? "Available" : "Coming soon"}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
      {isAvailable && (
        <p className="mt-4 text-xs font-medium text-amber-400">Open map →</p>
      )}
    </>
  );

  if (isAvailable) {
    return (
      <Link
        href={`/maps/${slug}`}
        className="block rounded-sm border border-zinc-700 bg-zinc-900 p-5 transition-colors hover:border-amber-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        aria-label={`Open ${name} interactive map`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-sm border border-zinc-800 bg-zinc-900 p-5 opacity-50">
      {content}
    </div>
  );
}
