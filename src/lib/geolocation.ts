import * as Location from "expo-location";

import type { Coordinates } from "@/core/domain/parking";

export async function getCurrentPosition(): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted)
    throw new Error("Location permission was not granted");

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy ?? 0,
  };
}

export async function watchCurrentPosition(
  onUpdate: (coordinates: Coordinates) => void,
): Promise<Location.LocationSubscription> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted)
    throw new Error("Location permission was not granted");

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      distanceInterval: 40,
      timeInterval: 30000,
    },
    (position) =>
      onUpdate({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? 0,
      }),
  );
}
