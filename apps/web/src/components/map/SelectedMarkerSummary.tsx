import type { Marker, MarkerCategory } from "@/types/marker";

interface SelectedMarkerSummaryProps {
  marker: Marker;
  category: MarkerCategory;
  onClear: () => void;
}

export default function SelectedMarkerSummary({
  marker,
  category,
  onClear,
}: SelectedMarkerSummaryProps) {
  return (
    <div className="mt-2 flex items-start gap-3 rounded-sm border border-zinc-800 bg-zinc-900 px-4 py-3">
      <span
        className="mt-1 h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{marker.name}</p>
        <p className="mb-1 text-xs" style={{ color: category.color }}>
          {category.label}
        </p>
        <p className="text-xs leading-relaxed text-zinc-400">
          {marker.shortDescription}
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 rounded-sm border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
        aria-label={`Clear selection: ${marker.name}`}
      >
        Clear
      </button>
    </div>
  );
}
