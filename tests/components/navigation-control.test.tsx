import { fireEvent, render } from "@testing-library/react-native";

import { NavigationControl } from "@/components/parking/navigation-control";

describe("NavigationControl", () => {
  it("starts in-app navigation when pressed", async () => {
    const onPress = jest.fn();
    const screen = await render(
      <NavigationControl isNavigating={false} onPress={onPress} />,
    );

    fireEvent.press(screen.getByRole("button"));

    expect(screen.getByText("เริ่มนำทางกลับ")).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows a stop action while navigation is active", async () => {
    const screen = await render(
      <NavigationControl isNavigating onPress={jest.fn()} />,
    );

    expect(screen.getByText("หยุดนำทาง")).toBeTruthy();
  });
});
