import { parseWalkingRoute } from "@/lib/mapbox-directions";

describe("Mapbox walking route response", () => {
  it("maps valid GeoJSON route data", () => {
    expect(parseWalkingRoute({ routes: [{ geometry: { type: "LineString", coordinates: [[100.5, 13.75], [100.51, 13.76]] }, distance: 250, duration: 180 }] })).toEqual({ coordinates: [[100.5, 13.75], [100.51, 13.76]], distanceMeters: 250, durationSeconds: 180 });
  });

  it("rejects malformed or incomplete route data", () => {
    expect(parseWalkingRoute(null)).toBeNull();
    expect(parseWalkingRoute({ routes: [{ geometry: { type: "Point", coordinates: [1, 2] }, distance: 20, duration: 30 }] })).toBeNull();
    expect(parseWalkingRoute({ routes: [{ geometry: { type: "LineString", coordinates: [["bad", 2]] }, distance: 20, duration: 30 }] })).toBeNull();
  });
});
