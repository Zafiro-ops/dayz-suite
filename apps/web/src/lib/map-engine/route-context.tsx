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
import { calcTotalDistance } from "./route-utils";

interface RoutePlannerContextValue {
  isActive: boolean;
  points: RoutePoint[];
  totalDistance: number;
  fitRouteTrigger: number;
  startRoute: () => void;
  addPoint: (x: number, y: number) => void;
  undoLastPoint: () => void;
  removePoint: (id: string) => void;
  clearRoute: () => void;
  reverseRoute: () => void;
  exitRoute: () => void;
  triggerFitRoute: () => void;
}

const RoutePlannerContext = createContext<RoutePlannerContextValue | null>(null);

export function RoutePlannerProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [fitRouteTrigger, setFitRouteTrigger] = useState(0);
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

  const removePoint = useCallback((id: string) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearRoute = useCallback(() => {
    counterRef.current = 0;
    setPoints([]);
  }, []);

  const reverseRoute = useCallback(() => {
    setPoints((prev) => [...prev].reverse());
  }, []);

  const exitRoute = useCallback(() => {
    setIsActive(false);
  }, []);

  const triggerFitRoute = useCallback(() => {
    setFitRouteTrigger((n) => n + 1);
  }, []);

  const totalDistance = useMemo(() => calcTotalDistance(points), [points]);

  const value = useMemo(
    () => ({
      isActive,
      points,
      totalDistance,
      fitRouteTrigger,
      startRoute,
      addPoint,
      undoLastPoint,
      removePoint,
      clearRoute,
      reverseRoute,
      exitRoute,
      triggerFitRoute,
    }),
    [
      isActive,
      points,
      totalDistance,
      fitRouteTrigger,
      startRoute,
      addPoint,
      undoLastPoint,
      removePoint,
      clearRoute,
      reverseRoute,
      exitRoute,
      triggerFitRoute,
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
