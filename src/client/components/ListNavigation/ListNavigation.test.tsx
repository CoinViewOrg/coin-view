import { render, screen } from "@testing-library/react";
import { ListNavigation } from "./ListNavigation";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const previousPage = jest.fn();
const nextPage = jest.fn();

describe("List navigation", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <ListNavigation nextPage={nextPage} page={2} prevPage={previousPage} />
      </I18nextProvider>
    );
    expect(screen.getByText("Next page")).toBeVisible();
    expect(screen.getByText("Previous page")).toBeVisible();
  });
});
