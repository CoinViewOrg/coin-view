import { fireEvent, render, screen } from "@testing-library/react";
import { NotificationsMenuItem } from "@coin-view/client";
import { I18nextProvider } from "react-i18next";
import { instanceEN } from "@coin-view/mocks";

const mockNotification = {
  Content: "<ul><li>Notification content</li></ul>",
  Date: "2023-04-17T20:00:00.000Z",
  NotificationId: 1,
  Seen: 1,
  Type: "PRICE_ALERT",
  Ua_Id: "1",
};

const Wrapper = ({ children }: { children: JSX.Element }) => {
  return <I18nextProvider i18n={instanceEN}>{children}</I18nextProvider>;
};

describe("Notifications menu item", () => {
  it("Basic render", () => {
    render(
      <Wrapper>
        <NotificationsMenuItem
          header={"There's been a sudden change in price"}
          content={mockNotification.Content}
          seen={mockNotification.Seen}
        />
      </Wrapper>
    );
    const button = screen.getByAltText("alert");
    fireEvent.click(button);
    expect(
      screen.getByText("There's been a sudden change in price")
    ).toBeVisible();
    expect(screen.getByText("Notification content")).toBeVisible();
    expect(
      screen.getByText("Notification content").parentElement?.parentElement
    ).toHaveClass("notificationActive");
  });
});
