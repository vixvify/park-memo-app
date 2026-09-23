import { z } from "zod";

export const parkingSchema = z.object({
  placeName: z.string(),
  floor: z.string(),
  zone: z.string(),
  parkingNumber: z.string(),
  note: z.string(),
});

export type ParkingInput = z.infer<typeof parkingSchema>;
