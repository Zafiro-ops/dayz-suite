export interface RoutePoint {
  id: string;
  x: number;
  y: number;
}

export interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
  createdAt: string;
  updatedAt: string;
}
