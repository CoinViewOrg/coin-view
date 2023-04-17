import { render, screen } from "@testing-library/react";
import { LoginForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const nextSignIn = jest.fn();
const ssoSignIn = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Login Form", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} />
      </Wrapper>
    );
    expect(screen.getByText("Log in to your account")).toBeVisible();
  });
  it("Error render", () => {
    render(
      <Wrapper>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} error={true} />
      </Wrapper>
    );
    expect(screen.getByText("Invalid username or password!")).toBeVisible();
  });
  it("Registered render", () => {
    render(
      <Wrapper>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          registered={"1"}
        />
      </Wrapper>
    );
    expect(
      screen.getByText("You have successfully created a new account!")
    ).toBeVisible();
    expect(screen.getByText("You can log in now.")).toBeVisible();
  });
  it("Password recovery success", () => {
    render(
      <Wrapper>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} passr={"1"} />
      </Wrapper>
    );
    expect(screen.getByText("Your password has been changed.")).toBeVisible();
  });
  it("Password recovery request", () => {
    render(
      <Wrapper>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          recoveryRequest={"1"}
        />
      </Wrapper>
    );
    expect(
      screen.getByText("You have submited recovery request.")
    ).toBeVisible();
    expect(
      screen.getByText(
        "If your username or email is correct, we will send you and email with further instructions."
      )
    ).toBeVisible();
  });
  it("SSO Login Error", () => {
    render(
      <Wrapper>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          googleSSOError={"1"}
        />
      </Wrapper>
    );
    expect(
      screen.getByText(
        "Email was already used to create an account. Try loggin in or reset your password."
      )
    ).toBeVisible();
  });
});
