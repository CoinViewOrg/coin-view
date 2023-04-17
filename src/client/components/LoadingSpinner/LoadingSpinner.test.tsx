import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("Loading spinner", () => {
  it("Unauthenticated basic render (PLN selected)", () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId("loading-spinner")).toBeVisible();
  });
});
