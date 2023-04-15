import { fireEvent, render, screen } from "@testing-library/react";
import { ModifyProfileForm } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";
import { Session } from "next-auth";

const onSubmit = jest.fn();
const thresholdSelect = jest.fn();
const expireDate = new Date();
let mockSession: Session = {
  user: {
    cryptoalerts: 1,
    newsletters: 1,
    productupdate: 1,
    google_sso: 0,
    email_verified: false,
    id: "1",
    name: "mockuser",
    email: "mockemail@mail.com",
  },
  expires: expireDate.toISOString(),
};
describe("Change Password Form", () => {
  it("Basic render (subscribed)", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
        />
      </I18nextProvider>
    );
    expect(screen.getByText("Profile settings")).toBeVisible();
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    const checkbox = screen.getByLabelText(
      "I want to receive notifications about news, cryptocurrencies and product updates"
    ) as HTMLInputElement;
    const nameField = screen.getByLabelText("Username") as HTMLInputElement;
    const emailField = screen.getByLabelText(
      "E-mail address"
    ) as HTMLInputElement;
    expect(checkbox.checked).toEqual(true);
    expect(nameField.value).toEqual(mockSession.user?.name);
    expect(emailField.value).toEqual(mockSession.user?.email);
  });

  it("Basic render (unsubscribed)", () => {
    mockSession.user!.cryptoalerts = 0;
    mockSession.user!.newsletters = 0;
    mockSession.user!.productupdate = 0;
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
        />
      </I18nextProvider>
    );
    expect(screen.getByText("Profile settings")).toBeVisible();
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    const checkbox = screen.getByLabelText(
      "I want to receive notifications about news, cryptocurrencies and product updates"
    ) as HTMLInputElement;
    const nameField = screen.getByLabelText("Username") as HTMLInputElement;
    const emailField = screen.getByLabelText(
      "E-mail address"
    ) as HTMLInputElement;
    expect(checkbox.checked).toEqual(false);
    expect(nameField.value).toEqual(mockSession.user?.name);
    expect(emailField.value).toEqual(mockSession.user?.email);
  });

  it("Bad credentials error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
          error={1}
        />
      </I18nextProvider>
    );
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    expect(
      screen.getByText("Please, provide correct username and/or email address.")
    ).toBeVisible();
  });

  it("User already exists error render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
          error={2}
        />
      </I18nextProvider>
    );
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    expect(
      screen.getByText("User with given username/email already exists.")
    ).toBeVisible();
  });

  it("Unverified email render", () => {
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
        />
      </I18nextProvider>
    );
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    expect(
      screen.getByText(
        "Please verify your email address to receive notifications and gain access to notifications settings"
      )
    ).toBeVisible();
  });

  it("Verified email render", () => {
    mockSession.user!.email_verified = true;
    render(
      <I18nextProvider i18n={instanceEN}>
        <ModifyProfileForm
          session={mockSession}
          threshold={null}
          onSubmit={onSubmit}
          thresholdSelect={thresholdSelect}
        />
      </I18nextProvider>
    );
    const button = screen.getByAltText("profile_set");
    fireEvent.click(button);
    expect(screen.getByText("Off")).toBeVisible();
  });
});
