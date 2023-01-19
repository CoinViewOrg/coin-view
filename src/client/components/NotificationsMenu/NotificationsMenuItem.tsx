import React from "react";
import styles from "./NotificationsMenuItem.module.css";
import cx from "classnames";
import Image from "next/future/image";

export const NotificationsMenuItem = ({
  header,
  content,
  seen,
}: {
  header: string;
  content: string;
  seen: number;
}) => {
  const [notificationActive, setNotificationActive] = React.useState(false);
  const [notificationSeen, setNotificationSeen] = React.useState(seen);

  const handleClick = React.useCallback(() => {
    setNotificationActive((notificationActive) => !notificationActive);
    setNotificationSeen(1);
  }, []);

  return (
    <div className={cx(styles.menuItem)}>
      <div className={cx(styles.wrapper)} onClick={handleClick}>
        {notificationSeen === 0 && (
          <div className={cx(styles.notificationBadge)}></div>
        )}
        <Image
          className={cx("svg-adaptive", styles.menuIcon)}
          src="/alert.svg"
          width={25}
          height={25}
          alt="alert"
        />
        <p>{header}</p>
      </div>
      <div
        className={cx(styles.contentWrapper, {
          [styles.notificationActive]: notificationActive,
        })}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
