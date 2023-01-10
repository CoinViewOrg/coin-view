import { useRouter } from "next/router";
import React, { ButtonHTMLAttributes, useContext } from "react";
import { Button } from "../Button";
import styles from "./ListSwitcher.module.css";
import cx from "classnames";
import { AppContext } from "@coin-view/context";
import { useCustomTranslation } from "@coin-view/client";

type PropsType = {};

export const ListSwitcher = ({}: PropsType) => {
  const { pathname, replace } = useRouter();
  const { currency } = useContext(AppContext);

  const { t } = useCustomTranslation();

  return (
    <div className={styles.container}>
      <button
        className={cx(styles.button, {
          [styles.active]: pathname.includes("list"),
        })}
        onClick={() => replace(`/list?currency=${currency}`)}
      >
        {t('all')}
      </button>
      <button
        className={cx(styles.button, {
          [styles.active]: pathname.includes("favorites"),
        })}
        onClick={() => replace(`/favorites?currency=${currency}`)}
      >
        {t("favourites")}
      </button>
    </div>
  );
};
