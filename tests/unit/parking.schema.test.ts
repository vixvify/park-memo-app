import { parkingSchema } from "@/core/schema/parking.schema";

describe("parking schema", () => {
  it("accepts every parking field as an empty string", () => {
    expect(parkingSchema.parse({ placeName: "", floor: "", zone: "", parkingNumber: "", note: "" })).toEqual({ placeName: "", floor: "", zone: "", parkingNumber: "", note: "" });
  });
});
