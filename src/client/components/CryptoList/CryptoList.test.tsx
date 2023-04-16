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

const mockCoinListItem: CoinListItem = {
  id: mockData.data[0].id,
  name: mockData.data[0].name,
  symbol: mockData.data[0].symbol,
  slug: mockData.data[0].slug,
  cmc_rank: mockData.data[0].cmc_rank,
  num_market_pairs: mockData.data[0].num_market_pairs,
  circulating_supply: mockData.data[0].circulating_supply,
  total_supply: mockData.data[0].total_supply,
  max_supply: mockData.data[0].max_supply,
  last_updated: mockData.data[0].last_updated,
  date_added: mockData.data[0].date_added,
  tags: mockData.data[0].tags,
  platform: mockData.data[0].platform,
  self_reported_circulating_supply:
    mockData.data[0].self_reported_circulating_supply,
  self_reported_market_cap: mockData.data[0].self_reported_market_cap,
  quote: mockData.data[0].quote,
};

const mockHistoricalDataType: Record<CurrencyType, HistoricalDataType> = {
  PLN: mockHistoricalData,
  USD: mockHistoricalData,
};

describe("Crypto List", () => {
  it("Basic render", () => {
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
        </AppContext.Provider>
      </I18nextProvider>
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
