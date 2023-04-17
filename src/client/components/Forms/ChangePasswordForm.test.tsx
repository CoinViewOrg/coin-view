import { fireEvent, render, screen } from "@testing-library/react";
import { ChangePasswordForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onSubmit = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Change Password Form", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <ChangePasswordForm onSubmit={onSubmit} />
      </Wrapper>
    );
    expect(screen.getByText("Security")).toBeVisible();
  });
  it("Password match error render", () => {
    render(
      <Wrapper>
        <ChangePasswordForm onSubmit={onSubmit} error={1} />
      </Wrapper>
    );
    const button = screen.getByAltText("security");
    fireEvent.click(button);
    expect(screen.getByText("New passwords do not match.")).toBeVisible();
  });
  it("Bad current password error render", () => {
    render(
      <Wrapper>
        <ChangePasswordForm onSubmit={onSubmit} error={2} />
      </Wrapper>
    );
    const button = screen.getByAltText("security");
    fireEvent.click(button);
    expect(
      screen.getByText("You provided wrong current password.")
    ).toBeVisible();
  });
});
