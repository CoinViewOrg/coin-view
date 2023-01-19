import { useRouter } from "next/router";
import React from "react";
import { NotificationsIcon } from "./NotificationsIcon";
import styles from "./NotificationsMenu.module.css";
import cx from "classnames";
import { useSession } from "next-auth/react";
import { LoadingSpinner, useCustomTranslation } from "@coin-view/client";
import { NotificationsMenuItem } from "@coin-view/client";

export const NotificationsMenu = () => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleNotificationsClick = React.useCallback(async () => {
    setMenuOpen((open) => !open);
    if (!menuOpen && notifications.length === 0) {
      setLoading(true);
      const response = await fetch("api/notifications");
      const { error, notifications } = await response.json();
      setLoading(false);
      setNotifications(notifications);
    }
  }, [menuOpen, notifications]);

  const notificationHeaders = React.useCallback(
    (type: string): string => {
      if (type === "PRICE_ALERT") {
        return t("price_alert");
      }

      return type;
    },
    [notifications]
  );

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className={styles.menu}>
      <>
        <NotificationsIcon
          width={32}
          height={32}
          className={cx("svg-adaptive", styles.bell)}
          onClick={handleNotificationsClick}
        />
        {menuOpen && (
          <>
            <div className={styles.menuContent}>
              {loading && (
                <div className={styles.spinner}>
                  <LoadingSpinner />
                </div>
              )}
              {!loading && (
                <>
                  {notifications?.length > 0 ? (
                    <>
                      {notifications?.map((notification) => (
                        <NotificationsMenuItem
                          key={notification.NotificationId.toString()}
                          header={notificationHeaders(notification.Type)}
                          content={notification.Content}
                        />
                      ))}
                    </>
                  ) : (
                    <p>{t("no_notification")}</p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </>
    </div>
  );
};
