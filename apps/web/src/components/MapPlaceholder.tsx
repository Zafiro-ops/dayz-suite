export default function MapPlaceholder() {
  return (
    <div className="flex w-full aspect-video flex-col items-center justify-center gap-3 rounded-sm border border-zinc-800 bg-zinc-900">
      <svg
        className="text-zinc-700"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
      <p className="text-xs text-zinc-500">
        Interactive map — coming in the next milestone
      </p>
    </div>
  );
}
