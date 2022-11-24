import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import { mockData, mockMeta } from "@coin-view/api";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home data={mockData} meta={mockMeta} />);

    const title = screen.getByText("Coin View");
    expect(title).toBeInTheDocument();
  });
});
