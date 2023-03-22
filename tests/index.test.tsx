import { render, screen } from "@testing-library/react";
import { Button } from "@coin-view/client";

describe("components", () => {
  it("button", () => {
    render(<Button>BUTTON</Button>);
    expect(screen.getByText("BUTTON")).toBeVisible();
  });
});
