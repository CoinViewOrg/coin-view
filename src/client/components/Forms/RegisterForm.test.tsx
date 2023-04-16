import { render, screen } from "@testing-library/react";
import { RegisterForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const register = jest.fn();
const ssoRegister = jest.fn();

describe("Register Form", () => {
  it("Basic render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <RegisterForm register={register} ssoRegister={ssoRegister} />
      </I18nextProvider>
    );
    expect(screen.getByText("Create new account")).toBeVisible();
  });
  it("Invalid credentials error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <RegisterForm register={register} ssoRegister={ssoRegister} error={1} />
      </I18nextProvider>
    );
    expect(
      screen.getByText("Please, provide correct username and/or email address.")
    ).toBeVisible();
  });
  it("User already exists error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <RegisterForm register={register} ssoRegister={ssoRegister} error={2} />
      </I18nextProvider>
    );
    expect(
      screen.getByText("User with given username/email already exists.")
    ).toBeVisible();
  });
});
