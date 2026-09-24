import * as Location from "expo-location";

import { watchCurrentPosition } from "@/lib/geolocation";

jest.mock("expo-location", () => ({
  Accuracy: { High: 6 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
}));

describe("watchCurrentPosition", () => {
  beforeEach(() => jest.clearAllMocks());

  it("streams foreground coordinates to the navigation screen", async () => {
    jest
      .mocked(Location.requestForegroundPermissionsAsync)
      .mockResolvedValue({ granted: true } as Location.LocationPermissionResponse);
    const subscription = { remove: jest.fn() } as unknown as Location.LocationSubscription;
    jest
      .mocked(Location.watchPositionAsync)
      .mockImplementation(async (_options, callback) => {
        callback({
          coords: {
            latitude: 13.75,
            longitude: 100.5,
            accuracy: null,
          },
        } as Location.LocationObject);
        return subscription;
      });
    const onUpdate = jest.fn();

    await expect(watchCurrentPosition(onUpdate)).resolves.toBe(subscription);

    expect(Location.watchPositionAsync).toHaveBeenCalledWith(
      expect.objectContaining({ accuracy: Location.Accuracy.High }),
      expect.any(Function),
    );
    expect(onUpdate).toHaveBeenCalledWith({
      latitude: 13.75,
      longitude: 100.5,
      accuracy: 0,
    });
  });

  it("does not start location updates without foreground permission", async () => {
    jest
      .mocked(Location.requestForegroundPermissionsAsync)
      .mockResolvedValue({ granted: false } as Location.LocationPermissionResponse);

    await expect(watchCurrentPosition(jest.fn())).rejects.toThrow(
      "Location permission was not granted",
    );
    expect(Location.watchPositionAsync).not.toHaveBeenCalled();
  });
});
