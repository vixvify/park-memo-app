import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ParkingDetailCard } from "@/components/parking/parking-detail-card";
import type { ParkingSpot } from "@/type/domain/parking";

const spot: ParkingSpot = {
  placeName: "เซ็นทรัล",
  floor: "B2",
  zone: "C",
  parkingNumber: "128",
  note: "ใกล้ลิฟต์",
  coordinates: null,
  savedAt: "2026-09-23T09:00:00.000Z",
};

describe("ParkingDetailCard", () => {
  it("shows saved parking details", () => {
    render(<ParkingDetailCard spot={spot} />);
    expect(
      screen.getByRole("heading", { name: "เซ็นทรัล" }),
    ).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("ใกล้ลิฟต์")).toBeInTheDocument();
  });

  it("keeps an empty record readable", () => {
    render(
      <ParkingDetailCard
        spot={{
          ...spot,
          placeName: "",
          floor: "",
          zone: "",
          parkingNumber: "",
          note: "",
        }}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "จุดจอดของฉัน" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("ชั้น")).not.toBeInTheDocument();
  });
});
