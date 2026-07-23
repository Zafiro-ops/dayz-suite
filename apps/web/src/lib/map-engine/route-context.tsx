"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import type { RoutePoint } from "@/types/route";

interface RoutePlannerContextValue {
  isActive: boolean;
  points: RoutePoint[];
  totalDistance: number;
  startRoute: () => void;
  addPoint: (x: number, y: number) => void;
  undoLastPoint: () => void;
  clearRoute: () => void;
  exitRoute: () => void;
}

const RoutePlannerContext = createContext<RoutePlannerContextValue | null>(null);

export function RoutePlannerProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const counterRef = useRef(0);

  const startRoute = useCallback(() => {
    counterRef.current = 0;
    setPoints([]);
    setIsActive(true);
  }, []);

  const addPoint = useCallback((x: number, y: number) => {
    counterRef.current += 1;
    const id = `rp-${counterRef.current}`;
    setPoints((prev) => [...prev, { id, x, y }]);
  }, []);

  const undoLastPoint = useCallback(() => {
    setPoints((prev) => prev.slice(0, -1));
  }, []);

  const clearRoute = useCallback(() => {
    counterRef.current = 0;
    setPoints([]);
  }, []);

  const exitRoute = useCallback(() => {
    setIsActive(false);
  }, []);

  const totalDistance = useMemo(() => {
    if (points.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  }, [points]);

  const value = useMemo(
    () => ({
      isActive,
      points,
      totalDistance,
      startRoute,
      addPoint,
      undoLastPoint,
      clearRoute,
      exitRoute,
    }),
    [
      isActive,
      points,
      totalDistance,
      startRoute,
      addPoint,
      undoLastPoint,
      clearRoute,
      exitRoute,
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
