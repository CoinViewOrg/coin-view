import { render, screen } from "@testing-library/react";
import { ListSwitcher } from "../ListSwitcher";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: jest.fn(),
}));

const mockRouter = {
  pathname: "/",
  replace: jest.fn(),
};

describe("List switcher", () => {
  it("Basic render", () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    render(
      <I18nextProvider i18n={instanceEN}>
        <ListSwitcher />
      </I18nextProvider>
    );
    expect(screen.getByText("All")).toBeVisible();
    expect(screen.getByText("Favourites")).toBeVisible();
  });
});
