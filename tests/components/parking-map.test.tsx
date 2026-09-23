import { render } from "@testing-library/react-native";
import { ParkingMap } from "@/components/parking/parking-map";

jest.mock("@rnmapbox/maps", () => ({
  __esModule: true,
  default: { setAccessToken: jest.fn(), StyleURL: { Street: "street" } },
}));

describe("ParkingMap", () => {
  it("keeps a clear placeholder when a Mapbox token is missing", async () => {
    const screen = await render(<ParkingMap currentLocation={null} parkingLocation={{ latitude: 13.75, longitude: 100.5, accuracy: 10 }} />);
    expect(screen.getByText("ยังไม่ได้ตั้งค่าแผนที่")).toBeTruthy();
    expect(screen.getByText("อัปเดตตำแหน่งเพื่อดูเส้นทาง")).toBeTruthy();
  });
});
