import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDatabase(database: SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY NOT NULL
    );
    CREATE TABLE IF NOT EXISTS parking_spot (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      place_name TEXT NOT NULL DEFAULT '',
      floor TEXT NOT NULL DEFAULT '',
      zone TEXT NOT NULL DEFAULT '',
      parking_number TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      latitude REAL,
      longitude REAL,
      accuracy REAL,
      saved_at TEXT NOT NULL
    );
    INSERT INTO schema_version (version)
    SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM schema_version);
  `);
}
