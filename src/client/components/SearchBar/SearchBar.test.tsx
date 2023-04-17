import { render, screen } from "@testing-library/react";
import { SearchBar } from "../SearchBar";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { useRouter } from "next/router";
import { AppContext } from "@coin-view/context";
import { Quote } from "@coin-view/types";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const mockRouter = {
  push: jest.fn(),
};
(useRouter as jest.Mock).mockReturnValue(mockRouter);

const Wrapper = ({
  children,
  currency,
}: {
  children: JSX.Element;
  currency?: keyof Quote;
}) => {
  return (
    <I18nextProvider i18n={instanceEN}>
      <AppContext.Provider
        value={{
          currency: currency ? currency : "PLN",
          favorites: [],
          notificationsMenuOpen: false,
          hamburgerMenuOpen: true,
          favoriteMarketName: null,
          colorTheme: "dark",
        }}
      >
        {children}
      </AppContext.Provider>
    </I18nextProvider>
  );
};

describe("Search bar", () => {
  it("Unauthenticated basic render (PLN selected)", () => {
    render(
      <Wrapper>
        <SearchBar />
      </Wrapper>
    );
    expect(screen.getByPlaceholderText("Find by name...")).toBeVisible();
    expect(screen.getByText("Search")).toBeVisible();
  });
});
