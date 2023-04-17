import { render, screen } from "@testing-library/react";
import { PasswordResetForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onSubmit = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Password Reset Form", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <PasswordResetForm onSubmit={onSubmit} />
      </Wrapper>
    );
    expect(screen.getByText("Set your new password")).toBeVisible();
  });
  it("Password match error render", () => {
    render(
      <Wrapper>
        <PasswordResetForm onSubmit={onSubmit} error={1} />
      </Wrapper>
    );
    expect(screen.getByText("New passwords do not match.")).toBeVisible();
  });
  it("Bad token error render", () => {
    render(
      <Wrapper>
        <PasswordResetForm onSubmit={onSubmit} error={2} />
      </Wrapper>
    );
    expect(
      screen.getByText("Your token has expired or has already been used.")
    ).toBeVisible();
  });
});
