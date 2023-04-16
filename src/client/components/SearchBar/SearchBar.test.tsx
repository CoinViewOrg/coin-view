import { render, screen } from "@testing-library/react";
import { SearchBar } from "../SearchBar";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { useRouter } from "next/router";
import { AppContext } from "@coin-view/context";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const mockRouter = {
  push: jest.fn(),
};

describe("Search bar", () => {
  it("Unauthenticated basic render (PLN selected)", () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <I18nextProvider i18n={instanceEN}>
        <AppContext.Provider
          value={{
            currency: "PLN",
            favorites: [],
            notificationsMenuOpen: false,
            hamburgerMenuOpen: true,
            favoriteMarketName: null,
            colorTheme: "dark",
          }}
        >
          <SearchBar />
        </AppContext.Provider>
      </I18nextProvider>
    );
    expect(screen.getByPlaceholderText("Find by name...")).toBeVisible();
    expect(screen.getByText("Search")).toBeVisible();
  });
});
