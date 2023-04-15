import { render, screen } from "@testing-library/react";
import { PasswordResetForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onSubmit = jest.fn();

describe("Password Reset Form", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <PasswordResetForm onSubmit={onSubmit} />
      </I18nextProvider>
    );
    expect(screen.getByText("Set your new password")).toBeVisible();
  });
  it("Password match error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <PasswordResetForm onSubmit={onSubmit} error={1} />
      </I18nextProvider>
    );
    expect(screen.getByText("New passwords do not match.")).toBeVisible();
  });
  it("Bad token error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <PasswordResetForm onSubmit={onSubmit} error={2} />
      </I18nextProvider>
    );
    expect(
      screen.getByText("Your token has expired or has already been used.")
    ).toBeVisible();
  });
});
