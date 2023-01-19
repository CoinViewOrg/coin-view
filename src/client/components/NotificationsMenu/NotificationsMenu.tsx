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

  const handleNotificationsClick = async () => {
    setMenuOpen((open) => !open);
    if(!menuOpen)
    {
      setLoading(true);
      const response = await fetch("api/notifications");
      const {error, notifications} = await response.json();
      setLoading(false);
      setNotifications(notifications);
    }
    else
    {
      setNotifications([]);
    }
  }

  function createNotificationHeaderText(type: string) {
    if (type === "PRICE_ALERT")
    {
      return t("price_alert");
    }
  }

  return (
    <div className={styles.menu}>
      {status !== "authenticated" ? (
        null
      ) : (
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
                <LoadingSpinner/>
              </div>
            )}
            {!loading && (
              <>
                {notifications?.length > 0 ? (
                  <>  
                  {notifications?.map((notification) => 
                    <NotificationsMenuItem 
                    key = {notification.NotificationId.toString()} 
                    header = {createNotificationHeaderText(notification.Type) as string}
                    content = {notification.Content} 
                    />
                  )}
                  </>
                ) : (
                  <p>Brak nowych powiadomień</p> 
                )}
              </>
            )}
          </div>
          </>
        )}
        </>
      )}
    </div>
  );
};
