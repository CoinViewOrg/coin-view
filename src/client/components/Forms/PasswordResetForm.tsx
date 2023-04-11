import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import cx from "classnames";
import { useRouter } from "next/router";

type PropsType = {
  onSubmit: (props: { newPassword: string; repeatNewPassword: string }) => void;
  error?: number;
};

export const PasswordResetForm = ({ onSubmit, error }: PropsType) => {
  const { t, language } = useCustomTranslation();
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const repeatNewPasswordRef = React.useRef<HTMLInputElement>(null);

  const checkPasswordValidity = React.useCallback(() => {
    const password = newPasswordRef.current?.value.trim();
    const confirmpassword = repeatNewPasswordRef.current?.value.trim();
    if (password !== confirmpassword && repeatNewPasswordRef.current) {
      repeatNewPasswordRef.current?.setCustomValidity("Passwords don't match!");
    } else {
      repeatNewPasswordRef.current?.setCustomValidity("");
    }
  }, [newPasswordRef, repeatNewPasswordRef]);

  const handleSubmit = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }

      const newPassword = newPasswordRef.current?.value.trim();
      const repeatNewPassword = repeatNewPasswordRef.current?.value.trim();

      if (!newPassword || !repeatNewPassword) {
        return;
      }

      onSubmit({ newPassword, repeatNewPassword });
    },
    [onSubmit, newPasswordRef, repeatNewPasswordRef]
  );

  return (
    <div className={cx(styles.container)}>
      <h2 className={styles.smallerMarginHeader}>
        {t("password_reset_form_header")}
      </h2>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <div className={styles.formItem}>
          <label htmlFor="newpassword">{t("password_form_new")}</label>
          <input
            id="newpassword"
            type="password"
            name="newpassword"
            maxLength={40}
            minLength={6}
            required
            ref={newPasswordRef}
          />
        </div>
        <div className={styles.formItem}>
          <label htmlFor="repeatpassword">{t("password_form_repeat")}</label>
          <input
            id="repeatpassword"
            type="password"
            name="repeatpassword"
            maxLength={40}
            required
            ref={repeatNewPasswordRef}
            onChange={checkPasswordValidity}
          />
        </div>
        <input
          className={styles.formSubmit}
          type="submit"
          value={t("form_save_button")}
        />
        {error && (
          <div>
            <span className={cx(styles.error, styles.profileFormSpan)}>
              {error == 1 && (
                <p className={styles.formParagraph}>
                  {t("passwords_no_match")}
                </p>
              )}
              {error == 2 && (
                <p className={styles.formParagraph}>{t("bad_token")}</p>
              )}
            </span>
          </div>
        )}
      </form>
    </div>
  );
};
