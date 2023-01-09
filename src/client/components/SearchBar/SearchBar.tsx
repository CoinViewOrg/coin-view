import { useCustomTranslation } from "@coin-view/client";
import { AppContext } from "@coin-view/context";
import { CurrencyType } from "@coin-view/types";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button";
import styles from "./SearchBar.module.css";

type PropsType = {
  initialValue?: string;
};

export const SearchBar = ({ initialValue }: PropsType) => {
  const { currency } = React.useContext(AppContext);

  const [phrase, setPhrase] = React.useState(initialValue || "");
  const { push } = useRouter();
  const searchPhrase = React.useCallback(() => {
    if (phrase.length) {
      push(`/search?phrase=${phrase}&currency=${currency}`);
    }
  }, [phrase, push, currency]);

  const submitOnEnter = React.useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === "Enter") {
        searchPhrase();
      }
    },
    [searchPhrase]
  );

  const { t } = useCustomTranslation();

  return (
    <div className={styles.container} data-testid="crypto_search">
      <input
        className={styles.input}
        onChange={(evt) => setPhrase(evt.target.value)}
        onKeyDown={submitOnEnter}
        value={phrase}
        placeholder={t("find_by_name")}
      />
      <Button onClick={searchPhrase}>{t("search")}</Button>
    </div>
  );
};
