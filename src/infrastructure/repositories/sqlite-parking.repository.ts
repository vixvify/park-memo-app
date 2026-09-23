import type { SQLiteDatabase } from "expo-sqlite";

import type {
  Coordinates,
  ParkingDetails,
  ParkingSpot,
} from "@/core/domain/parking";
import type { ParkingRepository } from "@/core/ports/parking.repository";

type ParkingRow = {
  place_name: string;
  floor: string;
  zone: string;
  parking_number: string;
  note: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  saved_at: string;
};

export function mapParkingRow(row: ParkingRow | null): ParkingSpot | null {
  if (!row) return null;
  const coordinates =
    row.latitude === null || row.longitude === null
      ? null
      : {
          latitude: row.latitude,
          longitude: row.longitude,
          accuracy: row.accuracy ?? 0,
        };

  return {
    placeName: row.place_name,
    floor: row.floor,
    zone: row.zone,
    parkingNumber: row.parking_number,
    note: row.note,
    coordinates,
    savedAt: row.saved_at,
  };
}

const selectCurrentSql = `SELECT place_name, floor, zone, parking_number, note, latitude, longitude, accuracy, saved_at FROM parking_spot WHERE id = 1`;

export function createSqliteParkingRepository(
  database: SQLiteDatabase,
): ParkingRepository {
  return {
    async getCurrent() {
      const row = await database.getFirstAsync<ParkingRow>(selectCurrentSql);
      return mapParkingRow(row);
    },
    async replaceCurrent(spot) {
      const { coordinates } = spot;
      await database.runAsync(
        `INSERT INTO parking_spot (id, place_name, floor, zone, parking_number, note, latitude, longitude, accuracy, saved_at)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET place_name=excluded.place_name, floor=excluded.floor, zone=excluded.zone,
         parking_number=excluded.parking_number, note=excluded.note, latitude=excluded.latitude,
         longitude=excluded.longitude, accuracy=excluded.accuracy, saved_at=excluded.saved_at`,
        spot.placeName,
        spot.floor,
        spot.zone,
        spot.parkingNumber,
        spot.note,
        coordinates?.latitude ?? null,
        coordinates?.longitude ?? null,
        coordinates?.accuracy ?? null,
        spot.savedAt,
      );
    },
    async updateDetails(details: ParkingDetails) {
      await database.runAsync(
        `UPDATE parking_spot SET place_name = ?, floor = ?, zone = ?, parking_number = ?, note = ? WHERE id = 1`,
        details.placeName,
        details.floor,
        details.zone,
        details.parkingNumber,
        details.note,
      );
      return this.getCurrent();
    },
    async updateCoordinates(coordinates: Coordinates, savedAt: string) {
      await database.runAsync(
        `UPDATE parking_spot SET latitude = ?, longitude = ?, accuracy = ?, saved_at = ? WHERE id = 1`,
        coordinates.latitude,
        coordinates.longitude,
        coordinates.accuracy,
        savedAt,
      );
      return this.getCurrent();
    },
    async clearCurrent() {
      await database.runAsync("DELETE FROM parking_spot WHERE id = 1");
    },
  };
}
