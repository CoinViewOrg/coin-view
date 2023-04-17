import { render, screen } from "@testing-library/react";
import { GoogleButton } from "../GoogleButton";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const onClick = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Google Button", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <GoogleButton onClick={onClick} />
      </Wrapper>
    );
    expect(screen.getByText("Sign in with Google")).toBeVisible();
  });
});
