import { createParkingService } from "@/core/service/parking.service";
import type { Coordinates, ParkingDetails, ParkingSpot } from "@/core/domain/parking";
import type { ParkingRepository } from "@/core/ports/parking.repository";

const initialDetails: ParkingDetails = { placeName: "ห้าง", floor: "B1", zone: "A", parkingNumber: "C-12", note: "ใกล้ลิฟต์" };
const firstPosition: Coordinates = { latitude: 13.75, longitude: 100.5, accuracy: 8 };
const movedPosition: Coordinates = { latitude: 13.751, longitude: 100.501, accuracy: 5 };

describe("parking flow", () => {
  it("persists the spot between service instances and changes its pin only on request", async () => {
    let savedSpot: ParkingSpot | null = null;
    const repository: ParkingRepository = {
      async getCurrent() { return savedSpot; },
      async replaceCurrent(spot) { savedSpot = spot; },
      async updateDetails(details) { if (savedSpot) savedSpot = { ...savedSpot, ...details }; return savedSpot; },
      async updateCoordinates(coordinates, savedAt) { if (savedSpot) savedSpot = { ...savedSpot, coordinates, savedAt }; return savedSpot; },
      async clearCurrent() { savedSpot = null; },
    };
    const firstSession = createParkingService({ repository, getCurrentPosition: async () => firstPosition, now: () => "saved" });
    await firstSession.saveNew(initialDetails);

    const secondSession = createParkingService({ repository, getCurrentPosition: async () => movedPosition, now: () => "moved" });
    expect(await secondSession.getCurrent()).toMatchObject({ ...initialDetails, coordinates: firstPosition, savedAt: "saved" });
    await secondSession.updateDetails({ ...initialDetails, floor: "2" });
    expect(await secondSession.getCurrent()).toMatchObject({ floor: "2", coordinates: firstPosition, savedAt: "saved" });
    await secondSession.moveToCurrentPosition();
    expect(await secondSession.getCurrent()).toMatchObject({ coordinates: movedPosition, savedAt: "moved" });
    await secondSession.clearCurrent();
    expect(await secondSession.getCurrent()).toBeNull();
  });
});
