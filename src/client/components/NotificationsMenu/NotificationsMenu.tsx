import { useRouter } from "next/router";
import React from "react";
import { NotificationsIcon } from "./NotificationsIcon";
import styles from "./NotificationsMenu.module.css";
import cx from "classnames";
import Image from "next/future/image";
import { signOut, useSession } from "next-auth/react";
import { useCustomTranslation } from "@coin-view/client";



export const NotificationsMenu = () => {
  const { push, pathname, replace } = useRouter();
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { language } = useCustomTranslation();
  const [notifications, setNotifications] = React.useState<any[]>([]);

  const handleNotificationsClick = async () => {
    setMenuOpen((open) => !open);
    if(!menuOpen)
    {
      const response = await fetch("api/notifications");
      const {error, notifications} = await response.json();
      setNotifications(notifications);
      console.log(notifications);
    }
  }

  function createNotificationHeaderText(type: string) {
    if (type === "PRICE_ALERT")
    {
      // {t("")}
      return "Nastąpiła nagła zmiana ceny";
    }
  }

  return (
    <div className={styles.menu}>
      <NotificationsIcon
        width={32}
        height={32}
        className={cx("svg-adaptive", styles.bell)}
        onClick={handleNotificationsClick}
      />
      {menuOpen && (
        <div className={styles.menuContent}>
          {notifications?.map((notification) => 
            <div key={notification.NotificationId.toString()} className={cx(styles.menuItem)}>
              <Image
                className={cx("svg-adaptive", styles.menuIcon)}
                src="/alert.svg"
                width={25}
                height={25}
                alt="alert"
              />
              <p dangerouslySetInnerHTML={{__html: createNotificationHeaderText(notification.Type) as string}}></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
