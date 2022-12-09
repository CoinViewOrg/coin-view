import { render, screen } from "@testing-library/react";
import Home from "../pages/index";
import { mockData } from "@coin-view/api";

const useRouter = jest.spyOn(require("next/router"), "useRouter");
useRouter.mockImplementation(() => ({
  pathname: "/",
}));

describe("Home", () => {
  it("renders search bar", () => {
    render(<Home data={mockData.data} meta={mockData.meta} />);

    const search = screen.getByTestId("crypto_search");
    expect(search).toBeInTheDocument();
  });

  it("renders crypto list", () => {
    render(<Home data={mockData.data} meta={mockData.meta} />);

    const list = screen.getByTestId("crypto_list");
    expect(list).toBeInTheDocument();
  });

  it("renders data in crypto list", () => {
    render(<Home data={mockData.data} meta={mockData.meta} />);

    const item = screen.getByTestId(`crypto_list_item_BTC`);
    const nameValue = item.getElementsByClassName("gridName")[0].textContent;
    const priceValue = item.getElementsByClassName("gridPrice")[0].textContent;
    const priceChangeValue =
      item.getElementsByClassName("gridPercentChange")[0].textContent;
    const volumeValue =
      item.getElementsByClassName("gridVolume")[0].textContent;

    const image = screen.getByAltText("BTC logo");

    expect(nameValue).toContain("Bitcoin");
    expect(priceValue).toContain("75879.57 PLN");
    expect(priceChangeValue).toContain("↘  0.342 %");
    expect(volumeValue).toContain("187259398270 PLN");
    expect(image).toBeInTheDocument();
  });
});
