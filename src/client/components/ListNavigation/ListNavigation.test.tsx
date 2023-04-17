import { render, screen } from "@testing-library/react";
import { ListNavigation } from "../ListNavigation";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const previousPage = jest.fn();
const nextPage = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("List navigation", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <ListNavigation nextPage={nextPage} page={2} prevPage={previousPage} />
      </Wrapper>
    );
    expect(screen.getByText("Next page")).toBeVisible();
    expect(screen.getByText("Previous page")).toBeVisible();
  });
});
