export type MapStatus = "available" | "coming-soon";

export interface MapDefinition {
  slug: string;
  name: string;
  status: MapStatus;
  description: string;
}
