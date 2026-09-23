import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentPosition } from "@/lib/geolocation";
import { useParkingStore } from "@/store/parking.store";

vi.mock("@/lib/geolocation", () => ({ getCurrentPosition: vi.fn() }));

const input = { placeName: "ห้าง", floor: "B1", zone: "A", parkingNumber: "12", note: "" };

describe("parking store", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useParkingStore.persist.clearStorage();
    useParkingStore.setState({ spot: null });
  });

  it("replaces the latest spot with the captured coordinates", async () => {
    vi.mocked(getCurrentPosition).mockResolvedValue({ latitude: 13.7, longitude: 100.5, accuracy: 9 });
    await useParkingStore.getState().saveSpot(input);
    expect(useParkingStore.getState().spot).toMatchObject({ placeName: "ห้าง", coordinates: { latitude: 13.7 } });
    await useParkingStore.getState().saveSpot({ ...input, placeName: "ที่ใหม่" });
    expect(useParkingStore.getState().spot?.placeName).toBe("ที่ใหม่");
  });

  it("keeps text when GPS fails and clears the spot on request", async () => {
    vi.mocked(getCurrentPosition).mockRejectedValue(new Error("GPS denied"));
    await useParkingStore.getState().saveSpot(input);
    expect(useParkingStore.getState().spot).toMatchObject({ ...input, coordinates: null });
    useParkingStore.getState().clearSpot();
    expect(useParkingStore.getState().spot).toBeNull();
  });

  it("restores the saved parking spot from browser storage", async () => {
    vi.mocked(getCurrentPosition).mockResolvedValue({
      latitude: 13.7,
      longitude: 100.5,
      accuracy: 9,
    });
    await useParkingStore.getState().saveSpot(input);
    const savedState = localStorage.getItem("findmycar-parking");

    expect(savedState).not.toBeNull();
    useParkingStore.setState({ spot: null });
    localStorage.setItem("findmycar-parking", savedState!);
    await useParkingStore.persist.rehydrate();

    expect(useParkingStore.getState().spot?.placeName).toBe("ห้าง");
  });
});
