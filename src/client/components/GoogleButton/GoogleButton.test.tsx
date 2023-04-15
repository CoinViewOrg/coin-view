import { render, screen } from "@testing-library/react";
import { GoogleButton } from "../GoogleButton";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onClick = jest.fn();

describe("Google Button", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <GoogleButton onClick={onClick} />
      </I18nextProvider>
    );
    expect(screen.getByText("Sign in with Google")).toBeVisible();
  });
});
