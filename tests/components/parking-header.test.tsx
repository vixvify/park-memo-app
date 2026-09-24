import { fireEvent, render } from "@testing-library/react-native";
import { router } from "expo-router";

import { ParkingHeader } from "@/components/parking/parking-header";

jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    canGoBack: jest.fn(),
    replace: jest.fn(),
  },
}));

describe("ParkingHeader back button", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns to the previous screen when navigation history exists", async () => {
    jest.mocked(router.canGoBack).mockReturnValue(true);
    const screen = await render(<ParkingHeader back />);

    fireEvent.press(screen.getByRole("button"));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("opens the home screen when there is no previous screen", async () => {
    jest.mocked(router.canGoBack).mockReturnValue(false);
    const screen = await render(<ParkingHeader back />);

    fireEvent.press(screen.getByRole("button"));

    expect(router.replace).toHaveBeenCalledWith("/");
    expect(router.back).not.toHaveBeenCalled();
  });
});
