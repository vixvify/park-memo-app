import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { ParkingForm } from "@/components/parking/parking-form";

describe("ParkingForm", () => {
  it("submits when every optional field is empty", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const screen = await render(<ParkingForm onSubmit={onSubmit} />);
    await fireEvent.press(screen.getByRole("button", { name: "บันทึกจุดจอด" }));
    await waitFor(() => expect(onSubmit.mock.calls[0]?.[0]).toEqual({ placeName: "", floor: "", zone: "", parkingNumber: "", note: "" }));
  });

  it("shows that edit mode retains the saved parking pin", async () => {
    const screen = await render(<ParkingForm isEditing initialValues={{ placeName: "ห้าง", floor: "B1", zone: "A", parkingNumber: "", note: "" }} onSubmit={jest.fn()} />);
    expect(screen.getByText("แก้ไขข้อความโดยคงพิกัดรถเดิม")).toBeTruthy();
  });
});
