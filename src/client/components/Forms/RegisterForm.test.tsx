import { render, screen } from "@testing-library/react";
import { RegisterForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const register = jest.fn();
const ssoRegister = jest.fn();

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Register Form", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <RegisterForm register={register} ssoRegister={ssoRegister} />
      </Wrapper>
    );
    expect(screen.getByText("Create new account")).toBeVisible();
  });
  it("Invalid credentials error render", () => {
    render(
      <Wrapper>
        <RegisterForm register={register} ssoRegister={ssoRegister} error={1} />
      </Wrapper>
    );
    expect(
      screen.getByText("Please, provide correct username and/or email address.")
    ).toBeVisible();
  });
  it("User already exists error render", () => {
    render(
      <Wrapper>
        <RegisterForm register={register} ssoRegister={ssoRegister} error={2} />
      </Wrapper>
    );
    expect(
      screen.getByText("User with given username/email already exists.")
    ).toBeVisible();
  });
});
