import type { Coordinates } from "@/core/domain/parking";

export function getCurrentPosition(): Promise<Coordinates> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.reject(new Error("Geolocation is unavailable"));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 0 },
    );
  });
}
