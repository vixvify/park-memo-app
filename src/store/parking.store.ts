import { create } from "zustand";

import type { ParkingSpot } from "@/core/domain/parking";
import type { ParkingInput } from "@/core/schema/parking.schema";
import { getCurrentPosition } from "@/lib/geolocation";

type ParkingState = {
  spot: ParkingSpot | null;
  saveSpot: (input: ParkingInput) => Promise<void>;
  clearSpot: () => void;
};

export const useParkingStore = create<ParkingState>((set) => ({
  spot: null,
  saveSpot: async (input) => {
    const coordinates = await getCurrentPosition().catch(() => null);
    set({ spot: { ...input, coordinates, savedAt: new Date().toISOString() } });
  },
  clearSpot: () => set({ spot: null }),
}));
