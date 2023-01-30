import React from "react";
import styles from "./NotificationsMenu.module.css";
import cx from "classnames";
import { useSession } from "next-auth/react";
import { LoadingSpinner, useCustomTranslation } from "@coin-view/client";
import { NotificationsMenuItem } from "@coin-view/client";
import { NotificationsBadge } from "./NotificationsBadge";
import { AppContext } from "@coin-view/context";
import Image from "next/image";

export const NotificationsMenu = ({
  onOpenCallback,
}: {
  onOpenCallback: () => void;
}) => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [notificationsCount, setNotificationsCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(false);

  const { notificationsMenuOpen: menuOpen } = React.useContext(AppContext);

  React.useEffect(() => {
    if (status === "authenticated") {
      const response = fetch("/api/notifications?param=count")
        .then((response) => response.json())
        .then((json) => {
          const { error, notifications } = json;
          setNotificationsCount(notifications[0].count);
        });
    }
  }, [status]);

  const handleNotificationsClick = React.useCallback(async () => {
    onOpenCallback();
    if (!menuOpen && notifications.length === 0) {
      setLoading(true);
      const response = await fetch("/api/notifications?param=fetch");
      const { error, notifications } = await response.json();
      setLoading(false);
      setNotifications(notifications);
      setNotificationsCount(0);
    }
  }, [menuOpen, notifications, onOpenCallback]);

  const notificationHeaders = React.useCallback(
    (type: string): string => {
      if (type === "PRICE_ALERT") {
        return t("price_alert");
      }

      return type;
    },
    [t]
  );

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={styles.menu}>
      <>
        {notificationsCount > 0 && (
          <NotificationsBadge count={notificationsCount} />
        )}
        <Image
          src={"/bell.svg"}
          width={32}
          height={32}
          className={cx("svg-adaptive", styles.bell)}
          onClick={handleNotificationsClick}
          alt="Notifications"
        />

        {menuOpen && (
          <div className={styles.menuContent}>
            {loading && (
              <div className={styles.spinner}>
                <LoadingSpinner />
              </div>
            )}
            {!loading &&
              (notifications?.length > 0 ? (
                <>
                  {notifications?.map((notification) => (
                    <NotificationsMenuItem
                      key={notification.NotificationId.toString()}
                      header={notificationHeaders(notification.Type)}
                      content={notification.Content}
                      seen={notification.Seen}
                    />
                  ))}
                </>
              ) : (
                <p>{t("no_notification")}</p>
              ))}
          </div>
        )}
      </>
    </div>
  );
};
