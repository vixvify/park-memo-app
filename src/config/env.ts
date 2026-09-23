import { z } from "zod";

import { AppError } from "@/core/errors/app.error";

const NodeEnvironmentSchema = z.enum(["development", "test", "production"]);

const ApiEnvironmentSchema = z.object({
  url: z
    .string()
    .trim()
    .url()
    .transform((value) => value.replace(/\/+$/, "")),
});

function getApiUrl() {
  const result = ApiEnvironmentSchema.safeParse({
    url: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    throw new AppError("API URL is not configured", 500);
  }

  return result.data.url;
}

function getAuthSecret() {
  return (
    process.env.BETTER_AUTH_SECRET ||
    "development-fallback-secret-key-min-32-chars"
  );
}

function getAuthUrl() {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000"
  );
}

export const config = {
  get databaseUrl() {
    return process.env.DATABASE_URL ?? "";
  },

  get googleMapsApiKey() {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  },

  get googleMapsMapId() {
    return process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID";
  },

  get apiUrl() {
    return getApiUrl();
  },

  get authSecret() {
    return getAuthSecret();
  },

  get authUrl() {
    return getAuthUrl();
  },

  get environment() {
    return NodeEnvironmentSchema.parse(process.env.NODE_ENV ?? "development");
  },

  get isProduction() {
    return config.environment === "production";
  },
};
