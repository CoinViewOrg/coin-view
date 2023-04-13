import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import cx from "classnames";

type PropsType = {
  onSubmit: (props: { usernameOrEmail?: string }) => void;
  error?: number;
};
export const RecoveryForm = ({ onSubmit, error }: PropsType) => {
  const usernameOrEmailRef = React.useRef<HTMLInputElement>(null);

  const { t, language } = useCustomTranslation();

  const handleSubmit = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      const usernameOrEmail = usernameOrEmailRef.current?.value.trim();

      if (!usernameOrEmail) {
        return;
      }

      onSubmit({ usernameOrEmail });
    },
    [onSubmit, usernameOrEmailRef]
  );

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h2 className={styles.smallerMarginHeader}>
        {t("recovery_form_header")}
      </h2>
      <hr></hr>
      <div className={styles.formItem}>
        <label htmlFor="usernameOrEmail">
          {t("recovery_form_input_label")}
        </label>
        <input
          id="usernameOrEmail"
          type="username"
          name="usernameOrEmail"
          required
          ref={usernameOrEmailRef}
        />
      </div>

      <input
        className={styles.formSubmit}
        type="submit"
        value={t("recovery_form_button")}
      />
      {error && (
        <span className={cx(styles.error, styles.profileFormSpan)}>
          {error == 1 && (
            <p className={styles.formParagraph}>{t("input_empty_error")}</p>
          )}
        </span>
      )}
    </form>
  );
};
