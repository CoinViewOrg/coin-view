import React from "react";
import styles from "./NotificationsMenu.module.css";
import cx from "classnames";
import { useSession } from "next-auth/react";
import { LoadingSpinner, useCustomTranslation } from "@coin-view/client";
import { NotificationsMenuItem } from "@coin-view/client";
import { NotificationsBadge } from "./NotificationsBadge";
import { AppContext } from "@coin-view/context";
import Image from "next/image";

type PropsType = {
  notificationsCount?: number;
  onOpenCallback: () => void;
  fetchNotifications: () => any;
};

export const NotificationsMenu = ({
  notificationsCount,
  onOpenCallback,
  fetchNotifications,
}: PropsType) => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [notificationsCounter, setNotificationsCounter] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setNotificationsCounter(notificationsCount!);
  }, [notificationsCount]);

  const { notificationsMenuOpen: menuOpen } = React.useContext(AppContext);

  const handleNotificationsClick = React.useCallback(async () => {
    onOpenCallback();
    if (!menuOpen && notifications.length === 0) {
      setLoading(true);
      setNotifications(await fetchNotifications());
      setLoading(false);
      setNotificationsCounter(0);
    }
  }, [menuOpen, notifications, onOpenCallback, fetchNotifications]);

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
        {notificationsCounter > 0 && (
          <NotificationsBadge count={notificationsCounter} />
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
