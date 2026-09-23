import { createParkingService } from "@/core/service/parking.service";
import type { ParkingRepository } from "@/core/ports/parking.repository";
import type { Coordinates, ParkingSpot } from "@/core/domain/parking";

const details = { placeName: "ห้าง", floor: "B1", zone: "A", parkingNumber: "C-12", note: "ใกล้ลิฟต์" };
const coordinates: Coordinates = { latitude: 13.75, longitude: 100.5, accuracy: 8 };

function createRepository(): ParkingRepository & { value: ParkingSpot | null } {
  const repository = {
    value: null as ParkingSpot | null,
    async getCurrent() { return this.value; },
    async replaceCurrent(spot: ParkingSpot) { this.value = spot; },
    async updateDetails(input: typeof details) { if (this.value) this.value = { ...this.value, ...input }; return this.value; },
    async updateCoordinates(position: Coordinates, savedAt: string) { if (this.value) this.value = { ...this.value, coordinates: position, savedAt }; return this.value; },
    async clearCurrent() { this.value = null; },
  };
  return repository;
}

describe("parking service", () => {
  it("saves text when location permission or GPS is unavailable", async () => {
    const repository = createRepository();
    const service = createParkingService({ repository, getCurrentPosition: async () => { throw new Error("denied"); }, now: () => "2026-09-23T00:00:00.000Z" });
    await service.saveNew(details);
    expect(repository.value).toEqual({ ...details, coordinates: null, savedAt: "2026-09-23T00:00:00.000Z" });
  });

  it("keeps the saved pin while editing text and moves it only on request", async () => {
    const repository = createRepository();
    repository.value = { ...details, coordinates, savedAt: "old" };
    const service = createParkingService({ repository, getCurrentPosition: async () => ({ ...coordinates, latitude: 14 }), now: () => "new" });
    await service.updateDetails({ ...details, floor: "2" });
    expect(repository.value?.coordinates).toEqual(coordinates);
    expect(repository.value?.savedAt).toBe("old");
    await service.moveToCurrentPosition();
    expect(repository.value?.coordinates?.latitude).toBe(14);
    expect(repository.value?.savedAt).toBe("new");
    await service.clearCurrent();
    expect(repository.value).toBeNull();
  });
});
