import React from "react";
import styles from "./NotificationsBadge.module.css";
import cx from "classnames";

export const NotificationsBadge = ({ count }: { count: number }) => {
  return <div className={cx(styles.badgeWrapper)}>{count}</div>;
};
