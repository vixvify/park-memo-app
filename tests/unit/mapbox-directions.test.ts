import {
  getNavigationRoute,
  parseNavigationRoute,
} from "@/lib/mapbox-directions";

jest.mock("@/config/env", () => ({
  env: { mapboxAccessToken: "pk.test-token" },
}));

const responsePayload = {
  routes: [
    {
      geometry: {
        type: "LineString",
        coordinates: [
          [100.5, 13.75],
          [100.51, 13.76],
        ],
      },
      distance: 250,
      duration: 180,
    },
  ],
};

describe("Mapbox Directions", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => responsePayload,
    });
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  it("maps valid GeoJSON route data", () => {
    expect(parseNavigationRoute(responsePayload)).toEqual({
      coordinates: [
        [100.5, 13.75],
        [100.51, 13.76],
      ],
      distanceMeters: 250,
      durationSeconds: 180,
    });
  });

  it("rejects malformed or incomplete route data", () => {
    expect(parseNavigationRoute(null)).toBeNull();
    expect(
      parseNavigationRoute({
        routes: [
          {
            geometry: { type: "Point", coordinates: [1, 2] },
            distance: 20,
            duration: 30,
          },
        ],
      }),
    ).toBeNull();
    expect(
      parseNavigationRoute({
        routes: [
          {
            geometry: { type: "LineString", coordinates: [["bad", 2]] },
            distance: 20,
            duration: 30,
          },
        ],
      }),
    ).toBeNull();
  });

  it.each([
    ["walking", "walking"],
    ["driving", "driving"],
  ] as const)("requests a %s directions profile", async (mode, profile) => {
    await getNavigationRoute(
      { latitude: 13.75, longitude: 100.5 },
      { latitude: 13.76, longitude: 100.51 },
      mode,
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/mapbox/${profile}/`),
    );
  });
});
