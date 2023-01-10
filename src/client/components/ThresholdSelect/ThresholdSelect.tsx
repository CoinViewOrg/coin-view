import React from "react";
import styles from "./ThresholdSelect.module.css";
import cx from "classnames";
import { useCustomTranslation } from "@coin-view/client";

const threshold_OPTIONS = [5, 8, 10];

type PropsType = {
  cryptoId: number;
  setCryptothreshold: (cryptoId: number, threshold: number) => void;
  cryptoThresholds: Record<number, number>;
  className: string;
};

export const ThresholdSelect = ({
  setCryptothreshold,
  cryptoId,
  cryptoThresholds,
  className,
}: PropsType) => {
  const { t } = useCustomTranslation();
  return (
    <div className={cx(styles.container, className)}>
      <p className={styles.thresholdDescription}>{t("threshold")}</p>
      <div className={styles.thresholdItems}>
        {threshold_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => setCryptothreshold(cryptoId, option)}
            className={cx(styles.thresholdItem, {
              [styles.active]: cryptoThresholds[cryptoId] === option,
            })}
          >
            {option}%
          </button>
        ))}
      </div>
    </div>
  );
};
