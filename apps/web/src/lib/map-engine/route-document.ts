import type { RouteDocument } from "@/types/route-document";
import type { RoutePoint } from "@/types/route";

const MAX_IMPORT_BYTES = 512 * 1024;
const SCHEMA = "dayz-suite-route" as const;
const VERSION = 1 as const;

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export function serializeRoute(
  mapSlug: string,
  routeName: string,
  points: RoutePoint[],
): RouteDocument {
  const now = new Date().toISOString();
  return {
    schema: SCHEMA,
    version: VERSION,
    mapSlug,
    routeName: routeName.trim() || "Unnamed Route",
    createdAt: now,
    updatedAt: now,
    points,
  };
}

export function validateRouteDocument(raw: unknown): Result<RouteDocument> {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Invalid file: not a JSON object." };
  }
  const doc = raw as Record<string, unknown>;
  if (doc.schema !== SCHEMA) {
    return { ok: false, error: "Invalid file: unrecognized schema." };
  }
  if (doc.version !== VERSION) {
    return {
      ok: false,
      error: `Unsupported version: ${String(doc.version)}.`,
    };
  }
  if (typeof doc.mapSlug !== "string" || !doc.mapSlug) {
    return { ok: false, error: "Invalid file: missing mapSlug." };
  }
  if (typeof doc.routeName !== "string") {
    return { ok: false, error: "Invalid file: routeName must be a string." };
  }
  if (!Array.isArray(doc.points)) {
    return { ok: false, error: "Invalid file: points must be an array." };
  }
  for (let i = 0; i < doc.points.length; i++) {
    const p: unknown = doc.points[i];
    if (typeof p !== "object" || p === null) {
      return { ok: false, error: `Invalid point at index ${i}.` };
    }
    const pt = p as Record<string, unknown>;
    if (
      typeof pt.id !== "string" ||
      typeof pt.x !== "number" ||
      typeof pt.y !== "number"
    ) {
      return {
        ok: false,
        error: `Point ${i}: expected id (string), x (number), y (number).`,
      };
    }
    if (pt.x < 0 || pt.x > 100 || pt.y < 0 || pt.y > 100) {
      return {
        ok: false,
        error: `Point ${i}: coordinates out of range [0, 100].`,
      };
    }
  }
  return { ok: true, data: raw as RouteDocument };
}

export function parseRouteFile(
  text: string,
  sizeBytes: number,
): Result<RouteDocument> {
  if (sizeBytes > MAX_IMPORT_BYTES) {
    return {
      ok: false,
      error: `File too large (max ${MAX_IMPORT_BYTES / 1024} KB).`,
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "Could not parse file as JSON." };
  }
  return validateRouteDocument(parsed);
}
