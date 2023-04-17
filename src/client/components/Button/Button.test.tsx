import { render, screen } from "@testing-library/react";
import { Button } from "@coin-view/client";

describe("Button", () => {
  it("Basic render", () => {
    render(<Button>Button</Button>);
    expect(screen.getByText("Button")).toBeVisible();
  });
});
