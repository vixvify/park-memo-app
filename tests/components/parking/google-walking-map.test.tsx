import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GoogleWalkingMap } from "@/components/parking/google-walking-map.client";
import { renderWalkingMap } from "@/lib/google-maps";

vi.mock("@/config", () => ({
  config: { googleMapsApiKey: "test-key" },
}));
vi.mock("@/lib/google-maps", () => ({ renderWalkingMap: vi.fn() }));

const coordinates = { latitude: 13.75, longitude: 100.5, accuracy: 10 };

describe("GoogleWalkingMap", () => {
  beforeEach(() => vi.resetAllMocks());

  it("waits for current GPS before requesting a route", () => {
    render(
      <GoogleWalkingMap currentLocation={null} parkingLocation={coordinates} />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("รอตำแหน่งปัจจุบัน");
    expect(renderWalkingMap).not.toHaveBeenCalled();
  });

  it("shows an error when map loading fails", async () => {
    vi.mocked(renderWalkingMap).mockRejectedValue(new Error("Map unavailable"));
    render(
      <GoogleWalkingMap
        currentLocation={coordinates}
        parkingLocation={coordinates}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "โหลดแผนที่ไม่สำเร็จ",
      ),
    );
  });

  it("shows when no walking route is available", async () => {
    vi.mocked(renderWalkingMap).mockResolvedValue(null);
    render(
      <GoogleWalkingMap
        currentLocation={coordinates}
        parkingLocation={coordinates}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("ไม่พบเส้นทางเดิน"),
    );
  });

  it("shows a route summary when routing succeeds", async () => {
    vi.mocked(renderWalkingMap).mockResolvedValue({
      summary: { distance: "150 ม.", duration: "2 นาที" },
      dispose: vi.fn(),
    });
    render(
      <GoogleWalkingMap
        currentLocation={coordinates}
        parkingLocation={coordinates}
      />,
    );
    expect(await screen.findByText("150 ม.")).toBeInTheDocument();
    expect(screen.getByText("2 นาที")).toBeInTheDocument();
  });
});
