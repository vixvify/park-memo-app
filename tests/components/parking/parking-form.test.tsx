import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ParkingForm } from "@/components/parking/parking-form.client";

describe("ParkingForm", () => {
  it("uses MUI icons for floor and zone instead of letter placeholders", () => {
    render(<ParkingForm onSubmit={vi.fn().mockResolvedValue(undefined)} />);
    expect(screen.getByTestId("LayersOutlinedIcon")).toBeInTheDocument();
    expect(screen.getByTestId("GridViewOutlinedIcon")).toBeInTheDocument();
    expect(screen.queryByText("F")).not.toBeInTheDocument();
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });

  it("submits every optional field as an empty string", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ParkingForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole("button", { name: "บันทึกจุดจอด" }));
    expect(onSubmit).toHaveBeenCalledWith(
      {
        placeName: "",
        floor: "",
        zone: "",
        parkingNumber: "",
        note: "",
      },
      expect.anything(),
    );
  });

  it("prefills saved details and submits edited values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ParkingForm
        initialValues={{
          placeName: "ห้างเดิม",
          floor: "B1",
          zone: "C",
          parkingNumber: "12",
          note: "ใกล้ลิฟต์",
        }}
        onSubmit={onSubmit}
      />,
    );
    const place = screen.getByRole("textbox", { name: "ชื่อห้างหรือสถานที่" });
    expect(place).toHaveValue("ห้างเดิม");
    await userEvent.clear(place);
    await userEvent.type(place, "ห้างใหม่");
    await userEvent.click(screen.getByRole("button", { name: "บันทึกจุดจอด" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ placeName: "ห้างใหม่", floor: "B1" }),
      expect.anything(),
    );
  });
});
