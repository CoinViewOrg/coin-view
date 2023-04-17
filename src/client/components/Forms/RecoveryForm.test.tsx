import { render, screen } from "@testing-library/react";
import { RecoveryForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onSubmit = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Recovery Form", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <RecoveryForm onSubmit={onSubmit} />
      </Wrapper>
    );
    expect(screen.getByText("Recover password")).toBeVisible();
  });
  it("Empty input error render", () => {
    render(
      <Wrapper>
        <RecoveryForm onSubmit={onSubmit} error={1} />
      </Wrapper>
    );
    expect(
      screen.getByText("Please fill out all required fields.")
    ).toBeVisible();
  });
});
