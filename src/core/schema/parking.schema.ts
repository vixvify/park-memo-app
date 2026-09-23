import { z } from "zod";

import type { ParkingDetails } from "@/core/domain/parking";

export const ParkingSchema = z.object({
  placeName: z.string(),
  floor: z.string(),
  zone: z.string(),
  parkingNumber: z.string(),
  note: z.string(),
}) satisfies z.ZodType<ParkingDetails>;

export type ParkingInput = z.infer<typeof ParkingSchema>;
