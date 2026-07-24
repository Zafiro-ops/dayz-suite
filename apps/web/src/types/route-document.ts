import type { RoutePoint } from "./route";

export interface RouteDocumentMetadata {
  description?: string;
  author?: string;
  tags?: string[];
}

export interface RouteDocument {
  schema: "dayz-suite-route";
  version: 1;
  mapSlug: string;
  routeName: string;
  createdAt: string;
  updatedAt: string;
  points: RoutePoint[];
  metadata?: RouteDocumentMetadata;
}
