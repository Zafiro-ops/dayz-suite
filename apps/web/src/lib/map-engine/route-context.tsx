"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import type { Route, RoutePoint } from "@/types/route";
import { calcTotalDistance } from "./route-utils";
import { clampNormalized } from "./coordinates";

function makeRoute(id: string, name: string): Route {
  const now = new Date().toISOString();
  return { id, name, points: [], createdAt: now, updatedAt: now };
}

interface RoutePlannerContextValue {
  isActive: boolean;
  points: RoutePoint[];
  routeName: string;
  totalDistance: number;
  fitRouteTrigger: number;
  routes: Route[];
  activeRouteId: string;
  startRoute: () => void;
  addPoint: (x: number, y: number) => void;
  undoLastPoint: () => void;
  removePoint: (id: string) => void;
  clearRoute: () => void;
  reverseRoute: () => void;
  exitRoute: () => void;
  triggerFitRoute: () => void;
  updatePointPosition: (id: string, x: number, y: number) => void;
  movePointUp: (id: string) => void;
  movePointDown: (id: string) => void;
  setRouteName: (name: string) => void;
  importRoute: (newPoints: RoutePoint[], name: string) => void;
  createRoute: (name?: string) => string;
  renameRoute: (id: string, name: string) => void;
  switchRoute: (id: string) => void;
  duplicateRoute: (id: string) => void;
  deleteRoute: (id: string) => void;
}

const RoutePlannerContext = createContext<RoutePlannerContextValue | null>(null);

export function RoutePlannerProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [routes, setRoutes] = useState<Route[]>(() => [
    makeRoute("route-1", "Unnamed Route"),
  ]);
  const [activeRouteId, setActiveRouteId] = useState("route-1");
  const [fitRouteTrigger, setFitRouteTrigger] = useState(0);
  const pointCounterRef = useRef(0);
  const routeCounterRef = useRef(1);

  // Self-heals if the active route is ever removed (e.g. deleteRoute) —
  // routes is guaranteed non-empty, so this always resolves to a valid id.
  useEffect(() => {
    if (!routes.some((r) => r.id === activeRouteId)) {
      setActiveRouteId(routes[0].id);
    }
  }, [routes, activeRouteId]);

  const activeRoute = useMemo(
    () => routes.find((r) => r.id === activeRouteId) ?? routes[0],
    [routes, activeRouteId],
  );

  // Applies a patch to the active route only, stamping updatedAt.
  const patchActiveRoute = useCallback(
    (patch: Partial<Route> | ((r: Route) => Partial<Route>)) => {
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id !== activeRouteId) return r;
          const p = typeof patch === "function" ? patch(r) : patch;
          return { ...r, ...p, updatedAt: new Date().toISOString() };
        }),
      );
    },
    [activeRouteId],
  );

  const updateActivePoints = useCallback(
    (updater: (points: RoutePoint[]) => RoutePoint[]) => {
      patchActiveRoute((r) => ({ points: updater(r.points) }));
    },
    [patchActiveRoute],
  );

  const startRoute = useCallback(() => {
    setIsActive(true);
  }, []);

  const addPoint = useCallback(
    (x: number, y: number) => {
      pointCounterRef.current += 1;
      const id = `rp-${pointCounterRef.current}`;
      updateActivePoints((points) => [...points, { id, x, y }]);
    },
    [updateActivePoints],
  );

  const undoLastPoint = useCallback(() => {
    updateActivePoints((points) => points.slice(0, -1));
  }, [updateActivePoints]);

  const removePoint = useCallback(
    (id: string) => {
      updateActivePoints((points) => points.filter((p) => p.id !== id));
    },
    [updateActivePoints],
  );

  const clearRoute = useCallback(() => {
    pointCounterRef.current = 0;
    updateActivePoints(() => []);
  }, [updateActivePoints]);

  const reverseRoute = useCallback(() => {
    updateActivePoints((points) => [...points].reverse());
  }, [updateActivePoints]);

  const exitRoute = useCallback(() => {
    setIsActive(false);
  }, []);

  const triggerFitRoute = useCallback(() => {
    setFitRouteTrigger((n) => n + 1);
  }, []);

  const updatePointPosition = useCallback(
    (id: string, x: number, y: number) => {
      updateActivePoints((points) =>
        points.map((p) =>
          p.id === id
            ? { ...p, x: clampNormalized(x), y: clampNormalized(y) }
            : p,
        ),
      );
    },
    [updateActivePoints],
  );

  const movePointUp = useCallback(
    (id: string) => {
      updateActivePoints((points) => {
        const idx = points.findIndex((p) => p.id === id);
        if (idx <= 0) return points;
        const next = [...points];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      });
    },
    [updateActivePoints],
  );

  const movePointDown = useCallback(
    (id: string) => {
      updateActivePoints((points) => {
        const idx = points.findIndex((p) => p.id === id);
        if (idx < 0 || idx >= points.length - 1) return points;
        const next = [...points];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      });
    },
    [updateActivePoints],
  );

  const renameRoute = useCallback((id: string, name: string) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, name, updatedAt: new Date().toISOString() } : r,
      ),
    );
  }, []);

  const setRouteName = useCallback(
    (name: string) => renameRoute(activeRouteId, name),
    [renameRoute, activeRouteId],
  );

  // Atomically replaces the active route's points with imported data.
  // Re-assigns sequential IDs so subsequent addPoint calls don't collide.
  const importRoute = useCallback(
    (newPoints: RoutePoint[], name: string) => {
      pointCounterRef.current = newPoints.length;
      patchActiveRoute({
        points: newPoints.map((p, i) => ({ ...p, id: `rp-${i + 1}` })),
        name: name.trim() || "Unnamed Route",
      });
      setIsActive(false);
    },
    [patchActiveRoute],
  );

  const createRoute = useCallback((name?: string) => {
    routeCounterRef.current += 1;
    const id = `route-${routeCounterRef.current}`;
    const route = makeRoute(id, name?.trim() || `Route ${routeCounterRef.current}`);
    setRoutes((prev) => [...prev, route]);
    setActiveRouteId(id);
    return id;
  }, []);

  const switchRoute = useCallback((id: string) => {
    setActiveRouteId(id);
  }, []);

  const duplicateRoute = useCallback(
    (id: string) => {
      const source = routes.find((r) => r.id === id);
      if (!source) return;
      routeCounterRef.current += 1;
      const newId = `route-${routeCounterRef.current}`;
      const now = new Date().toISOString();
      const copy: Route = {
        id: newId,
        name: `${source.name} (Copy)`,
        points: source.points.map((p) => ({ ...p })),
        createdAt: now,
        updatedAt: now,
      };
      setRoutes((prev) => [...prev, copy]);
      setActiveRouteId(newId);
    },
    [routes],
  );

  const deleteRoute = useCallback((id: string) => {
    setRoutes((prev) => {
      const remaining = prev.filter((r) => r.id !== id);
      if (remaining.length > 0) return remaining;
      // Never leave zero routes — recreate a blank one.
      routeCounterRef.current += 1;
      return [makeRoute(`route-${routeCounterRef.current}`, "Unnamed Route")];
    });
  }, []);

  const totalDistance = useMemo(
    () => calcTotalDistance(activeRoute.points),
    [activeRoute.points],
  );

  const value = useMemo(
    () => ({
      isActive,
      points: activeRoute.points,
      routeName: activeRoute.name,
      totalDistance,
      fitRouteTrigger,
      routes,
      activeRouteId,
      startRoute,
      addPoint,
      undoLastPoint,
      removePoint,
      clearRoute,
      reverseRoute,
      exitRoute,
      triggerFitRoute,
      updatePointPosition,
      movePointUp,
      movePointDown,
      setRouteName,
      importRoute,
      createRoute,
      renameRoute,
      switchRoute,
      duplicateRoute,
      deleteRoute,
    }),
    [
      isActive,
      activeRoute,
      totalDistance,
      fitRouteTrigger,
      routes,
      activeRouteId,
      startRoute,
      addPoint,
      undoLastPoint,
      removePoint,
      clearRoute,
      reverseRoute,
      exitRoute,
      triggerFitRoute,
      updatePointPosition,
      movePointUp,
      movePointDown,
      setRouteName,
      importRoute,
      createRoute,
      renameRoute,
      switchRoute,
      duplicateRoute,
      deleteRoute,
    ],
  );

  return (
    <RoutePlannerContext.Provider value={value}>
      {children}
    </RoutePlannerContext.Provider>
  );
}

export function useRoutePlannerContext(): RoutePlannerContextValue {
  const ctx = useContext(RoutePlannerContext);
  if (!ctx)
    throw new Error(
      "useRoutePlannerContext must be used inside RoutePlannerProvider",
    );
  return ctx;
}
