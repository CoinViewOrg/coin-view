import React from "react";
import styles from "./NotificationsMenuItem.module.css";
import cx from "classnames";
import Image from "next/future/image";

export const NotificationsMenuItem = ({
  header,
  content,
}: {
  header: string;
  content: string;
}) => {
  const [notificationActive, setNotificationActive] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setNotificationActive((notificationActive) => !notificationActive);
  }, []);

  return (
    <div className={cx(styles.menuItem)}>
      <div className={cx(styles.wrapper)} onClick={handleClick}>
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
