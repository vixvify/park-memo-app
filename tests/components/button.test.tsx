import { fireEvent, render } from "@testing-library/react-native";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("calls its action and exposes the button label", async () => {
    const onPress = jest.fn();
    const screen = await render(<Button onPress={onPress}>บันทึก</Button>);
    fireEvent.press(screen.getByRole("button", { name: "บันทึก" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
