export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export type ParkingDetails = {
  placeName: string;
  floor: string;
  zone: string;
  parkingNumber: string;
  note: string;
};

export type ParkingSpot = ParkingDetails & {
  coordinates: Coordinates | null;
  savedAt: string;
};
