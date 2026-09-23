import { config } from "@/config";
import type { Coordinates } from "@/core/domain/parking";
import { formatDistance, formatDuration } from "@/utils/parking";

export type GoogleLatLng = { lat: number; lng: number };

export type GoogleMap = {
  fitBounds: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
};

export type GooglePolyline = { setMap: (map: GoogleMap | null) => void };
export type GoogleAdvancedMarker = { map: GoogleMap | null };

export type GoogleRoute = {
  path?: GoogleLatLng[];
  legs?: Array<{ distanceMeters?: number; durationMillis?: number }>;
  createPolylines: () => GooglePolyline[];
};

type GoogleMapLibrary = {
  Map: new (
    element: HTMLElement,
    options: {
      center: GoogleLatLng;
      zoom: number;
      mapId: string;
      mapTypeControl: boolean;
      streetViewControl: boolean;
      fullscreenControl: boolean;
      clickableIcons: boolean;
    },
  ) => GoogleMap;
};

type GoogleRoutesLibrary = {
  Route: {
    computeRoutes: (request: {
      origin: GoogleLatLng;
      destination: GoogleLatLng;
      travelMode: "WALKING";
      fields: string[];
    }) => Promise<{ routes?: GoogleRoute[] }>;
  };
};

type GoogleCoreLibrary = {
  LatLngBounds: new () => {
    extend: (position: GoogleLatLng) => void;
    toJSON: () => { north: number; south: number; east: number; west: number };
  };
};

type GoogleMarkerLibrary = {
  AdvancedMarkerElement: new (options: {
    map: GoogleMap;
    position: GoogleLatLng;
    title: string;
    content: HTMLElement;
  }) => GoogleAdvancedMarker;
};

type GoogleMapsApi = {
  importLibrary: (name: string) => Promise<unknown>;
};

declare global {
  interface Window {
    google?: { maps?: GoogleMapsApi };
    __findMyCarGoogleMapsPromise?: Promise<GoogleMapsApi>;
    __findMyCarGoogleMapsReady?: () => void;
    __findMyCarGoogleMapsFailed?: () => void;
  }
}

export async function loadGoogleMaps(apiKey: string): Promise<GoogleMapsApi> {
  if (window.google?.maps?.importLibrary) return window.google.maps;
  if (window.__findMyCarGoogleMapsPromise)
    return window.__findMyCarGoogleMapsPromise;

  window.__findMyCarGoogleMapsPromise = new Promise((resolve, reject) => {
    window.__findMyCarGoogleMapsReady = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error("Google Maps loaded without its maps library."));
    };
    window.__findMyCarGoogleMapsFailed = () =>
      reject(new Error("Google Maps could not be loaded."));

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async&v=weekly&callback=__findMyCarGoogleMapsReady`;
    script.async = true;
    script.defer = true;
    script.onerror = () => window.__findMyCarGoogleMapsFailed?.();
    document.head.appendChild(script);
  });

  return window.__findMyCarGoogleMapsPromise;
}

export async function getGoogleMapLibrary(api: GoogleMapsApi) {
  const [maps, routes, core, marker] = await Promise.all([
    api.importLibrary("maps"),
    api.importLibrary("routes"),
    api.importLibrary("core"),
    api.importLibrary("marker"),
  ]);
  return {
    maps: maps as GoogleMapLibrary,
    routes: routes as GoogleRoutesLibrary,
    core: core as GoogleCoreLibrary,
    marker: marker as GoogleMarkerLibrary,
  };
}

export type WalkingRouteSummary = { distance: string; duration: string };

export type WalkingMapResult = {
  summary: WalkingRouteSummary | null;
  dispose: () => void;
};

function toLatLng(coordinates: Coordinates): GoogleLatLng {
  return { lat: coordinates.latitude, lng: coordinates.longitude };
}

function createMarkerContent(kind: "car" | "user") {
  const marker = document.createElement("span");
  marker.className = `map-pin map-pin-${kind}`;
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = kind === "car" ? "P" : "●";
  return marker;
}

export async function renderWalkingMap(
  element: HTMLElement,
  currentLocation: Coordinates,
  parkingLocation: Coordinates,
): Promise<WalkingMapResult | null> {
  const api = await loadGoogleMaps(config.googleMapsApiKey);
  const { maps, routes, core, marker } = await getGoogleMapLibrary(api);
  const origin = toLatLng(currentLocation);
  const destination = toLatLng(parkingLocation);
  const map = new maps.Map(element, {
    center: destination,
    zoom: 17,
    mapId: config.googleMapsMapId,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    clickableIcons: false,
  });

  const result = await routes.Route.computeRoutes({
    origin,
    destination,
    travelMode: "WALKING",
    fields: ["path", "legs.distanceMeters", "legs.durationMillis"],
  });
  const route = result.routes?.[0];
  if (!route) return null;

  const polylines = route.createPolylines();
  polylines.forEach((polyline) => polyline.setMap(map));
  const markers = [
    new marker.AdvancedMarkerElement({
      map,
      position: destination,
      title: "รถของคุณ",
      content: createMarkerContent("car"),
    }),
    new marker.AdvancedMarkerElement({
      map,
      position: origin,
      title: "ตำแหน่งปัจจุบัน",
      content: createMarkerContent("user"),
    }),
  ];
  const bounds = new core.LatLngBounds();
  bounds.extend(origin);
  bounds.extend(destination);
  route.path?.forEach((point) => bounds.extend(point));
  map.fitBounds(bounds.toJSON());

  const leg = route.legs?.[0];
  return {
    summary:
      leg?.distanceMeters !== undefined && leg.durationMillis !== undefined
        ? {
            distance: formatDistance(leg.distanceMeters),
            duration: formatDuration(leg.durationMillis),
          }
        : null,
    dispose: () => {
      polylines.forEach((polyline) => polyline.setMap(null));
      markers.forEach((mapMarker) => {
        mapMarker.map = null;
      });
    },
  };
}
