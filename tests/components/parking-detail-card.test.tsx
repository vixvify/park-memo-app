import { render } from "@testing-library/react-native";

import type { ParkingSpot } from "@/core/domain/parking";
import { ParkingDetailCard } from "@/components/parking/parking-detail-card";

const spot: ParkingSpot = {
  placeName: "เซ็นทรัล",
  floor: "B2",
  zone: "C",
  parkingNumber: "C-128",
  note: "ใกล้ลิฟต์แก้ว",
  coordinates: null,
  savedAt: "2026-09-23T00:00:00.000Z",
};

describe("ParkingDetailCard", () => {
  it("shows the useful parking details", async () => {
    const screen = await render(<ParkingDetailCard spot={spot} />);
    expect(screen.getByText("เซ็นทรัล")).toBeTruthy();
    expect(screen.getByText("ชั้น B2 · โซน C · หมายเลข C-128")).toBeTruthy();
    expect(screen.getByText("ใกล้ลิฟต์แก้ว")).toBeTruthy();
  });

  it("omits empty optional details", async () => {
    const screen = await render(<ParkingDetailCard spot={{ ...spot, placeName: "", floor: "", zone: "", parkingNumber: "", note: "" }} />);
    expect(screen.getByText("จุดจอดของฉัน")).toBeTruthy();
    expect(screen.queryByText("จุดสังเกต")).toBeNull();
  });
});
