import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, ButtonLink } from "@/components/ui/button";

describe("shared UI buttons", () => {
  it("handles clicks and respects the disabled state", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <>
        <Button onClick={onClick}>บันทึก</Button>
        <Button disabled onClick={onClick}>
          ปิดใช้งาน
        </Button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "บันทึก" }));
    await user.click(screen.getByRole("button", { name: "ปิดใช้งาน" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders a styled link for navigation actions", () => {
    render(
      <ButtonLink href="/parking" variant="secondary">
        ดูจุดจอด
      </ButtonLink>,
    );

    expect(screen.getByRole("link", { name: "ดูจุดจอด" })).toHaveAttribute(
      "href",
      "/parking",
    );
  });
});
