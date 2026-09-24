import { fireEvent, render } from "@testing-library/react-native";

import { RouteModeSelector } from "@/components/parking/route-mode-selector";

describe("RouteModeSelector", () => {
  it("lets the user choose a driving route", async () => {
    const onChange = jest.fn();
    const screen = await render(
      <RouteModeSelector value="walking" onChange={onChange} />,
    );

    fireEvent.press(screen.getByRole("button", { name: "รถ" }));

    expect(onChange).toHaveBeenCalledWith("driving");
  });
});
