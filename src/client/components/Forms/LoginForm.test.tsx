import { render, screen } from "@testing-library/react";
import { LoginForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/tests-data";

const nextSignIn = jest.fn();
const ssoSignIn = jest.fn();

describe("Login Form", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} />
      </I18nextProvider>
    );
    expect(screen.getByText("Log in to your account")).toBeVisible();
  });
  it("Error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} error={true} />
      </I18nextProvider>
    );
    expect(screen.getByText("Invalid username or password!")).toBeVisible();
  });
  it("Registered render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          registered={"1"}
        />
      </I18nextProvider>
    );
    expect(
      screen.getByText("You have successfully created a new account!")
    ).toBeVisible();
    expect(screen.getByText("You can log in now.")).toBeVisible();
  });
  it("Password recovery success", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <LoginForm nextSignIn={nextSignIn} ssoSignIn={ssoSignIn} passr={"1"} />
      </I18nextProvider>
    );
    expect(screen.getByText("Your password has been changed.")).toBeVisible();
  });
  it("Password recovery request", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          recoveryRequest={"1"}
        />
      </I18nextProvider>
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
      <I18nextProvider i18n={instanceEN}>
        <LoginForm
          nextSignIn={nextSignIn}
          ssoSignIn={ssoSignIn}
          googleSSOError={"1"}
        />
      </I18nextProvider>
    );
    expect(
      screen.getByText(
        "Email was already used to create an account. Try loggin in or reset your password."
      )
    ).toBeVisible();
  });
});
