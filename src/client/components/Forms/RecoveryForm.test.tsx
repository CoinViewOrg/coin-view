import { render, screen } from "@testing-library/react";
import { RecoveryForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onSubmit = jest.fn();

describe("Recovery Form", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <RecoveryForm onSubmit={onSubmit} />
      </I18nextProvider>
    );
    expect(screen.getByText("Recover password")).toBeVisible();
  });
  it("Empty input error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <RecoveryForm onSubmit={onSubmit} error={1} />
      </I18nextProvider>
    );
    expect(
      screen.getByText("Please fill out all required fields.")
    ).toBeVisible();
  });
});
