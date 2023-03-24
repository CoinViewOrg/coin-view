import React from "react";
import styles from "./ThresholdSelect.module.css";
import cx from "classnames";
import { useCustomTranslation } from "@coin-view/client";

const threshold_OPTIONS = [null, 5, 8, 10];

type PropsType = {
  className: string;
  userThreshold: any;
};

export const ThresholdSelect = ({ className, userThreshold }: PropsType) => {
  const { t } = useCustomTranslation();

  const [threshold, setThreshold] = React.useState<number | null>(
    userThreshold ? userThreshold : null
  );

  const handleClick = React.useCallback(async (option: number | null) => {
    await fetch("/api/setuserthreshold", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        option,
      }),
    });
    setThreshold(option);
  }, []);

  return (
    <div className={cx(styles.container, className)}>
      <p className={styles.thresholdDescription}>{t("threshold")}</p>
      <div className={styles.thresholdItems}>
        {threshold_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={cx(styles.thresholdItem, {
              [styles.active]: threshold === option,
            })}
          >
            {option}
            {option === null ? t("notiff_off") : "%"}
          </button>
        ))}
      </div>
    </div>
  );
};
