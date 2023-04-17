import { render, screen } from "@testing-library/react";
import { NotificationsMenu } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { SessionProvider } from "next-auth/react";
import { AppContext } from "@coin-view/context";
import { Session } from "next-auth";
import { Quote } from "@coin-view/types";

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

const Wrapper = ({
  children,
  session,
  currency,
  menuOpen,
}: {
  children: JSX.Element;
  session: Session | null;
  currency?: keyof Quote;
  menuOpen?: boolean;
}) => {
  return (
    <I18nextProvider i18n={instanceEN}>
      <SessionProvider session={session}>
        <AppContext.Provider
          value={{
            currency: currency ? currency : "PLN",
            favorites: [],
            notificationsMenuOpen: menuOpen ? menuOpen : false,
            hamburgerMenuOpen: true,
            favoriteMarketName: null,
            colorTheme: "dark",
          }}
        >
          {children}
        </AppContext.Provider>
      </SessionProvider>
    </I18nextProvider>
  );
};

describe("Notifications menu", () => {
  it("Basic render", () => {
    render(
      <Wrapper session={mockSession}>
        <NotificationsMenu
          notificationsCount={14}
          onOpenCallback={onOpenCallback}
          fetchNotifications={fetchNotifications}
        />
      </Wrapper>
    );
    expect(screen.getByText("14")).toBeVisible();
  });

  it("Opened render", () => {
    render(
      <Wrapper session={mockSession} menuOpen={true}>
        <NotificationsMenu
          notificationsCount={14}
          onOpenCallback={onOpenCallback}
          fetchNotifications={fetchNotifications}
        />
      </Wrapper>
    );
    expect(screen.getByText("There are no new notifications")).toBeVisible();
  });
});
