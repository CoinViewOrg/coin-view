import { render, screen } from "@testing-library/react";
import { HamburgerMenu } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { AppContext } from "@coin-view/context";
import { Session } from "next-auth";
import { Quote } from "@coin-view/types";

const toggleCurrency = jest.fn();
const onOpenCallback = jest.fn();
const toggleDarkMode = jest.fn();

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));
const mockRouter = {
  push: jest.fn(),
  pathname: "/",
  replace: jest.fn(),
};
(useRouter as jest.Mock).mockReturnValue(mockRouter);

const expireDate = new Date();

const Wrapper = ({
  children,
  session,
  currency,
}: {
  children: JSX.Element;
  session: Session | null;
  currency?: keyof Quote;
}) => {
  return (
    <I18nextProvider i18n={instanceEN}>
      <SessionProvider session={session}>
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
      </SessionProvider>
    </I18nextProvider>
  );
};

describe("Humburger Menu", () => {
  it("Unauthenticated basic render (PLN selected)", () => {
    const mockSession = null;

    render(
      <Wrapper session={mockSession}>
        <HamburgerMenu
          toggleCurrency={toggleCurrency}
          onOpenCallback={onOpenCallback}
          toggleDarkMode={toggleDarkMode}
        />
      </Wrapper>
    );
    expect(screen.getByText("PLN")).toHaveClass("currencySelected");
    expect(screen.getByText("USD")).toBeVisible();
    expect(screen.getByText("Language:")).toBeVisible();
    expect(screen.getByText("EN")).toBeVisible();
    expect(screen.getByText("PL")).toBeVisible();
    expect(screen.getByText("Login")).toBeVisible();
    expect(screen.getByText("Register")).toBeVisible();
  });

  it("Authenticated basic render (USD selected)", () => {
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

    render(
      <Wrapper session={mockSession} currency="USD">
        <HamburgerMenu
          toggleCurrency={toggleCurrency}
          onOpenCallback={onOpenCallback}
          toggleDarkMode={toggleDarkMode}
        />
      </Wrapper>
    );
    expect(screen.getByText("PLN")).toBeVisible();
    expect(screen.getByText("USD")).toHaveClass("currencySelected");
    expect(screen.getByText("Language:")).toBeVisible();
    expect(screen.getByText("EN")).toBeVisible();
    expect(screen.getByText("PL")).toBeVisible();
    expect(screen.getByText(mockSession.user?.name as string)).toBeVisible();
    expect(screen.getByText("Sign out")).toBeVisible();
  });
});
