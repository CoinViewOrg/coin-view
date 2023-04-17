import { render, screen } from "@testing-library/react";
import { NotificationsMenu } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { SessionProvider } from "next-auth/react";
import { AppContext } from "@coin-view/context";
import { Session } from "next-auth";

const fetchNotifications = jest.fn();
const onOpenCallback = jest.fn();

const expireDate = new Date();
const mockSession: Session = {
  user: {
    cryptoalerts: 1,
    newsletters: 1,
    productupdate: 1,
    google_sso: 0,
    email_verified: false,
    id: "1",
    name: "mockuser",
    email: "mockemail@mail.com",
  },
  expires: expireDate.toISOString(),
};

describe("Notifications menu", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <SessionProvider session={mockSession}>
          <AppContext.Provider
            value={{
              currency: "PLN",
              favorites: [],
              notificationsMenuOpen: false,
              hamburgerMenuOpen: false,
              favoriteMarketName: null,
              colorTheme: "dark",
            }}
          >
            <NotificationsMenu
              notificationsCount={14}
              onOpenCallback={onOpenCallback}
              fetchNotifications={fetchNotifications}
            />
          </AppContext.Provider>
        </SessionProvider>
      </I18nextProvider>
    );
    expect(screen.getByText("14")).toBeVisible();
  });

  it("Opened render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <SessionProvider session={mockSession}>
          <AppContext.Provider
            value={{
              currency: "PLN",
              favorites: [],
              notificationsMenuOpen: true,
              hamburgerMenuOpen: false,
              favoriteMarketName: null,
              colorTheme: "dark",
            }}
          >
            <NotificationsMenu
              notificationsCount={14}
              onOpenCallback={onOpenCallback}
              fetchNotifications={fetchNotifications}
            />
          </AppContext.Provider>
        </SessionProvider>
      </I18nextProvider>
    );
    expect(screen.getByText("There are no new notifications")).toBeVisible();
  });
});
