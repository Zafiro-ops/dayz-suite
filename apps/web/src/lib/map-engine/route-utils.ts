import type { RoutePoint } from "@/types/route";

export function calcSegmentDistance(a: RoutePoint, b: RoutePoint): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calcTotalDistance(points: RoutePoint[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calcSegmentDistance(points[i - 1], points[i]);
  }
  return total;
}
