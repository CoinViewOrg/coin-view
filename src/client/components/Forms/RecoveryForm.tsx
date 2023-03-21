import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { useRouter } from "next/router";
import cx from "classnames";

export const RecoveryForm = () => {
  const usernameOrEmailRef = React.useRef<HTMLInputElement>(null);

  const { t, language } = useCustomTranslation();

  const { push } = useRouter();

  const [error, setError] = React.useState();

  const submitForm = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;

      const usernameOrEmail = usernameOrEmailRef.current?.value.trim();

      if (!usernameOrEmail) {
        return;
      }

      const response = await fetch("/api/setrecoveryrequest", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail,
        }),
      });

      const { error } = await response.json();

      if (error) {
        setError(error);
      } else {
        push(`/login?recoveryrequest=1`, undefined, { locale: language });
      }
    },
    [usernameOrEmailRef, push, language]
  );

  return (
    <form className={styles.container} onSubmit={submitForm}>
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
