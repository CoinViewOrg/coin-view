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
(useRouter as jest.Mock).mockReturnValue(mockRouter);

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("List switcher", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <ListSwitcher />
      </Wrapper>
    );
    expect(screen.getByText("All")).toBeVisible();
    expect(screen.getByText("Favourites")).toBeVisible();
  });
});
