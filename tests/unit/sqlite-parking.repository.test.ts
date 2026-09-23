import type { SQLiteDatabase } from "expo-sqlite";

import { createSqliteParkingRepository, mapParkingRow } from "@/infrastructure/repositories/sqlite-parking.repository";
import type { ParkingSpot } from "@/core/domain/parking";

describe("SQLite parking repository mapping", () => {
  it("restores a spot and its coordinates from a database row", () => {
    expect(mapParkingRow({ place_name: "ห้าง", floor: "B1", zone: "A", parking_number: "9", note: "", latitude: 13.75, longitude: 100.5, accuracy: 9, saved_at: "now" })).toMatchObject({ placeName: "ห้าง", coordinates: { latitude: 13.75, longitude: 100.5, accuracy: 9 }, savedAt: "now" });
    expect(mapParkingRow(null)).toBeNull();
  });

  it("loads the singleton record", async () => {
    const database = { getFirstAsync: jest.fn().mockResolvedValue({ place_name: "Mall", floor: "", zone: "", parking_number: "", note: "", latitude: null, longitude: null, accuracy: null, saved_at: "now" }) } as unknown as SQLiteDatabase;
    const repository = createSqliteParkingRepository(database);
    expect(await repository.getCurrent()).toMatchObject({ placeName: "Mall", coordinates: null });
    expect(database.getFirstAsync).toHaveBeenCalledWith(expect.stringContaining("WHERE id = 1"));
  });

  it("writes, edits, moves, and clears the singleton record", async () => {
    const runAsync = jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 });
    const getFirstAsync = jest.fn().mockResolvedValue({ place_name: "Mall", floor: "", zone: "", parking_number: "", note: "", latitude: 13.75, longitude: 100.5, accuracy: 8, saved_at: "saved" });
    const database = { runAsync, getFirstAsync } as unknown as SQLiteDatabase;
    const repository = createSqliteParkingRepository(database);
    const spot: ParkingSpot = { placeName: "Mall", floor: "B1", zone: "C", parkingNumber: "12", note: "", coordinates: { latitude: 13.75, longitude: 100.5, accuracy: 8 }, savedAt: "saved" };

    await repository.replaceCurrent(spot);
    expect(runAsync).toHaveBeenLastCalledWith(expect.stringContaining("INSERT INTO parking_spot"), "Mall", "B1", "C", "12", "", 13.75, 100.5, 8, "saved");
    await repository.updateDetails({ ...spot, floor: "2" });
    expect(runAsync).toHaveBeenLastCalledWith(expect.stringContaining("UPDATE parking_spot SET place_name"), "Mall", "2", "C", "12", "");
    await repository.updateCoordinates({ latitude: 13.76, longitude: 100.51, accuracy: 5 }, "moved");
    expect(runAsync).toHaveBeenLastCalledWith(expect.stringContaining("latitude = ?"), 13.76, 100.51, 5, "moved");
    await repository.clearCurrent();
    expect(runAsync).toHaveBeenLastCalledWith(expect.stringContaining("DELETE FROM parking_spot WHERE id = 1"));
  });
});
