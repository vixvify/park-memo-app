import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import ParkingPage from "@/app/parking/page";
import { getCurrentPosition } from "@/lib/geolocation";
import { useParkingStore } from "@/store/parking.store";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/lib/geolocation", () => ({ getCurrentPosition: vi.fn() }));
vi.mock("@/components/parking/google-walking-map.client", () => ({
  GoogleWalkingMap: () => <div>แผนที่ทดสอบ</div>,
}));

describe("parking pages", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useParkingStore.setState({ spot: null });
  });

  it("saves entered details and shows them on the parking page", async () => {
    vi.mocked(getCurrentPosition).mockResolvedValue({
      latitude: 13.75,
      longitude: 100.5,
      accuracy: 8,
    });
    const home = render(<Home />);
    await userEvent.type(
      screen.getByRole("textbox", { name: "ชื่อห้างหรือสถานที่" }),
      "ห้างตัวอย่าง",
    );
    await userEvent.type(screen.getByRole("textbox", { name: "ชั้น" }), "B2");
    await userEvent.click(screen.getByRole("button", { name: "บันทึกจุดจอด" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/parking"));
    expect(useParkingStore.getState().spot?.coordinates?.latitude).toBe(13.75);
    home.unmount();
    render(<ParkingPage />);
    expect(screen.getByText("ห้างตัวอย่าง")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByText("แผนที่ทดสอบ")).toBeInTheDocument();
  });

  it("still saves text when GPS is denied, then clears the spot", async () => {
    vi.mocked(getCurrentPosition).mockRejectedValue(
      new Error("Permission denied"),
    );
    const home = render(<Home />);
    await userEvent.type(
      screen.getByRole("textbox", { name: "หมายเลขที่จอด" }),
      "C-128",
    );
    await userEvent.click(screen.getByRole("button", { name: "บันทึกจุดจอด" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/parking"));
    expect(useParkingStore.getState().spot?.coordinates).toBeNull();
    home.unmount();
    render(<ParkingPage />);
    expect(screen.getByText("C-128")).toBeInTheDocument();
    expect(screen.getByText("ไม่มีพิกัด GPS")).toBeInTheDocument();
    expect(screen.queryByText("แผนที่ทดสอบ")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "ล้างจุดจอด" }));
    expect(
      screen.getByRole("heading", { name: "ยังไม่มีจุดจอด" }),
    ).toBeInTheDocument();
  });
});
