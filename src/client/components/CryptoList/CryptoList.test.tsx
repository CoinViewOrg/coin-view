import { fireEvent, render, screen } from "@testing-library/react";
import { CryptoList } from "@coin-view/client";
import { mockData } from "@coin-view/mocks";
import { mockHistoricalData } from "@coin-view/mocks";
import { CoinListItem, CurrencyType } from "@coin-view/types";
import { HistoricalDataType } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { AppContext } from "@coin-view/context";

const getHistoricalData = jest.fn();
const addToFavorites = jest.fn();

const mockCoinListItem: CoinListItem = mockData.data[0];

const mockHistoricalDataType: Record<CurrencyType, HistoricalDataType> = {
  PLN: mockHistoricalData,
  USD: mockHistoricalData,
};

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return (
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
        {children}
      </AppContext.Provider>
    </I18nextProvider>
  );
};

describe("Crypto List", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <CryptoList
          loading={false}
          cryptoList={[mockCoinListItem]}
          getHistoricalData={getHistoricalData}
          metaList={mockData.meta}
          loadingHistorical={false}
          addToFavorites={addToFavorites}
          historicalData={mockHistoricalDataType}
          favorites={[]}
        />
      </Wrapper>
    );
    expect(screen.getByText("Bitcoin")).toBeVisible();
    expect(screen.getByText("0.342 %")).toBeVisible();
    const button = screen.getByText("Bitcoin");
    fireEvent.click(button);
    expect(
      screen.getByText("No historical data for given cryptocurrency :(")
    ).toBeVisible();
    expect(screen.getByText("Buy on")).toBeVisible();
    expect(screen.getByText("coinbase")).toBeVisible();
  });
});
