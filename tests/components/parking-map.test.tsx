import { act, render, waitFor } from "@testing-library/react-native";

import { ParkingMap } from "@/components/parking/parking-map";
import { env } from "@/config/env";
import { getNavigationRoute } from "@/lib/mapbox-directions";
import type { NavigationRoute } from "@/core/domain/parking";

jest.mock("@/config/env", () => ({
  env: { mapboxAccessToken: "pk.test-token" },
}));

jest.mock("@/lib/mapbox-directions", () => ({
  getNavigationRoute: jest.fn(),
}));

jest.mock("@rnmapbox/maps", () => {
  const ReactRuntime = jest.requireActual<typeof import("react")>("react");
  const ReactNative = jest.requireActual<typeof import("react-native")>(
    "react-native",
  );
  const MockMapComponent = ({
    children,
    id,
  }: {
    children?: import("react").ReactNode;
    id?: string;
  }) =>
    ReactRuntime.createElement(
      ReactNative.View,
      { testID: id ? `map-${id}` : undefined },
      children,
    );

  return {
    __esModule: true,
    default: {
      setAccessToken: jest.fn(),
      StyleURL: { Street: "street" },
      MapView: MockMapComponent,
      Camera: MockMapComponent,
      PointAnnotation: MockMapComponent,
      UserLocation: MockMapComponent,
      ShapeSource: MockMapComponent,
      LineLayer: MockMapComponent,
    },
  };
});

const currentLocation = {
  latitude: 13.75,
  longitude: 100.5,
  accuracy: 10,
};
const parkingLocation = {
  latitude: 13.76,
  longitude: 100.51,
  accuracy: 10,
};
const route = {
  coordinates: [
    [100.5, 13.75],
    [100.51, 13.76],
  ] as [number, number][],
  distanceMeters: 250,
  durationSeconds: 180,
};

describe("ParkingMap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    env.mapboxAccessToken = "pk.test-token";
    jest.mocked(getNavigationRoute).mockResolvedValue(route);
  });

  it("shows a route only while in-app navigation is active", async () => {
    let resolveRoute!: (value: NavigationRoute) => void;
    jest.mocked(getNavigationRoute).mockImplementation(
      () => new Promise((resolve) => {
        resolveRoute = resolve;
      }),
    );
    const screen = await render(
      <ParkingMap
        currentLocation={currentLocation}
        isNavigating
        parkingLocation={parkingLocation}
        routeMode="walking"
      />,
    );

    expect(getNavigationRoute).toHaveBeenCalledWith(
      currentLocation,
      parkingLocation,
      "walking",
    );
    await act(async () => {
      resolveRoute(route);
    });
    await waitFor(() =>
      expect(screen.getByTestId("map-navigation-route")).toBeTruthy(),
    );

    await act(async () => {
      screen.rerender(
        <ParkingMap
          currentLocation={currentLocation}
          isNavigating={false}
          parkingLocation={parkingLocation}
          routeMode="walking"
        />,
      );
    });

    expect(screen.queryByTestId("map-navigation-route")).toBeNull();
    expect(screen.getByText("เริ่มนำทางเพื่อดูเส้นทาง")).toBeTruthy();
  });

  it("does not request or draw a route while navigation is stopped", async () => {
    const screen = await render(
      <ParkingMap
        currentLocation={currentLocation}
        isNavigating={false}
        parkingLocation={parkingLocation}
        routeMode="driving"
      />,
    );

    expect(screen.queryByTestId("map-navigation-route")).toBeNull();
    expect(getNavigationRoute).not.toHaveBeenCalled();
  });
});
