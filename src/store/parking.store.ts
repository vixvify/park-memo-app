import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ParkingSpot } from "@/type/domain/parking";
import type { ParkingInput } from "@/type/schema/parking.schema";
import { getCurrentPosition } from "@/lib/geolocation";

type ParkingState = {
  spot: ParkingSpot | null;
  saveSpot: (input: ParkingInput) => Promise<void>;
  clearSpot: () => void;
};

const parkingStorage = createJSONStorage<ParkingState>(() => {
  if (typeof window !== "undefined") return window.localStorage;

  return {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  };
});

export const useParkingStore = create<ParkingState>()(
  persist(
    (set) => ({
      spot: null,
      saveSpot: async (input) => {
        const coordinates = await getCurrentPosition().catch(() => null);
        set({ spot: { ...input, coordinates, savedAt: new Date().toISOString() } });
      },
      clearSpot: () => set({ spot: null }),
    }),
    {
      name: "findmycar-parking",
      storage: parkingStorage,
      skipHydration: true,
    },
  ),
);
