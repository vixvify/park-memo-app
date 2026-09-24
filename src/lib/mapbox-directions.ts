import type {
  NavigationRoute,
  RouteMode,
} from "@/core/domain/parking";
import { env } from "@/config/env";

type MapboxDirectionsResponse = {
  routes?: {
    geometry?: { type?: string; coordinates?: unknown };
    distance?: number;
    duration?: number;
  }[];
};

export function parseNavigationRoute(
  payload: unknown,
): NavigationRoute | null {
  if (!payload || typeof payload !== "object") return null;
  const routes = (payload as MapboxDirectionsResponse).routes;
  const route = routes?.[0];
  const coordinates = route?.geometry?.coordinates;
  if (
    !route ||
    route.geometry?.type !== "LineString" ||
    !Array.isArray(coordinates)
  )
    return null;
  if (
    !coordinates.every(
      (point) =>
        Array.isArray(point) &&
        point.length >= 2 &&
        point.every(Number.isFinite),
    )
  )
    return null;
  if (!Number.isFinite(route.distance) || !Number.isFinite(route.duration))
    return null;

  return {
    coordinates: coordinates.map(
      (point) => [point[0], point[1]] as [number, number],
    ),
    distanceMeters: route.distance!,
    durationSeconds: route.duration!,
  };
}

export async function getNavigationRoute(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
  mode: RouteMode,
): Promise<NavigationRoute> {
  if (!env.mapboxAccessToken) throw new Error("missing-token");
  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordinates}?overview=full&geometries=geojson&access_token=${encodeURIComponent(env.mapboxAccessToken)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("route-unavailable");
  const route = parseNavigationRoute(await response.json());
  if (!route) throw new Error("route-unavailable");
  return route;
}
