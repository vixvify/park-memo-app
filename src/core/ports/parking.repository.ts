import type { Coordinates, ParkingDetails, ParkingSpot } from "@/core/domain/parking";

export interface ParkingRepository {
  getCurrent(): Promise<ParkingSpot | null>;
  replaceCurrent(spot: ParkingSpot): Promise<void>;
  updateDetails(details: ParkingDetails): Promise<ParkingSpot | null>;
  updateCoordinates(coordinates: Coordinates, savedAt: string): Promise<ParkingSpot | null>;
  clearCurrent(): Promise<void>;
}
