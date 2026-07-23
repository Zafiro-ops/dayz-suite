"use client";

import { SVGOverlay } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";

interface NeutralMapBackgroundProps {
  bounds: LatLngBoundsExpression;
}

export default function NeutralMapBackground({ bounds }: NeutralMapBackgroundProps) {
  return (
    <SVGOverlay bounds={bounds} interactive={false}>
      <defs>
        <pattern
          id="neutralGrid"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#27272a"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#09090b" />
      <rect width="100%" height="100%" fill="url(#neutralGrid)" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#3f3f46"
        fontSize="14"
        fontFamily="system-ui, ui-sans-serif, sans-serif"
      >
        Fictional development canvas
      </text>
    </SVGOverlay>
  );
}
