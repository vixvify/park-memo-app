import type {
  Coordinates,
  ParkingDetails,
} from "@/core/domain/parking";
import type { ParkingRepository } from "@/core/ports/parking.repository";

type ParkingServiceDependencies = {
  repository: ParkingRepository;
  getCurrentPosition: () => Promise<Coordinates>;
  now?: () => string;
};

export function createParkingService({
  repository,
  getCurrentPosition,
  now = () => new Date().toISOString(),
}: ParkingServiceDependencies) {
  return {
    getCurrent: () => repository.getCurrent(),
    async saveNew(details: ParkingDetails) {
      const coordinates = await getCurrentPosition().catch(() => null);
      await repository.replaceCurrent({
        ...details,
        coordinates,
        savedAt: now(),
      });
    },
    updateDetails: (details: ParkingDetails) =>
      repository.updateDetails(details),
    async moveToCurrentPosition() {
      const coordinates = await getCurrentPosition();
      return repository.updateCoordinates(coordinates, now());
    },
    clearCurrent: () => repository.clearCurrent(),
  };
}

export type ParkingService = ReturnType<typeof createParkingService>;
