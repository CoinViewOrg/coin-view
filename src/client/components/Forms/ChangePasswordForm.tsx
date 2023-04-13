import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import cx from "classnames";
import Image from "next/future/image";

type PropsType = {
  onSubmit: (props: {
    oldPassword?: string;
    newPassword?: string;
    repeatNewPassword?: string;
  }) => void;
  error?: number;
};

export const ChangePasswordForm = ({ onSubmit, error }: PropsType) => {
  const { t } = useCustomTranslation();
  const oldPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const repeatNewPasswordRef = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);

  const handleClick = React.useCallback(() => {
    setOpen((open) => (open = !open));
  }, []);

  const arrowIconMode = React.useMemo(
    () => (open === false ? "down" : "up"),
    [open]
  );

  const checkPasswordValidity = React.useCallback(() => {
    const password = newPasswordRef.current?.value;
    const confirmpassword = repeatNewPasswordRef.current?.value;
    if (password !== confirmpassword && repeatNewPasswordRef.current) {
      repeatNewPasswordRef.current?.setCustomValidity("Passwords don't match!");
    } else {
      repeatNewPasswordRef.current?.setCustomValidity("");
    }
  }, [newPasswordRef, repeatNewPasswordRef]);

  const handleSubmit = React.useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }
      const oldPassword = oldPasswordRef.current?.value.trim();
      const newPassword = newPasswordRef.current?.value.trim();
      const repeatNewPassword = repeatNewPasswordRef.current?.value.trim();

      onSubmit({ oldPassword, newPassword, repeatNewPassword });
    },
    [onSubmit]
  );

  return (
    <div className={cx(styles.container, styles.profileForm)}>
      <div className={cx(styles.formLabel)} onClick={handleClick}>
        <Image
          src={"/shield_lock.svg"}
          width={32}
          height={32}
          className={cx("svg-adaptive")}
          alt={"security"}
        />
        <p>{t("password_form_label")}</p>
        <Image
          src={`/arrow_${arrowIconMode}.svg`}
          width={32}
          height={32}
          className={cx("svg-adaptive", styles.rightFormLabelIcon)}
          alt={"arrow"}
        />
      </div>
      {open && (
        <form onSubmit={handleSubmit}>
          <div className={styles.formItem}>
            <label htmlFor="oldpassword">{t("password_form_old")}</label>
            <input
              id="oldpassword"
              type="password"
              name="oldpassword"
              maxLength={40}
              required
              ref={oldPasswordRef}
            />
          </div>
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
            <span className={cx(styles.error, styles.profileFormSpan)}>
              {error == 1 && (
                <p className={styles.formParagraph}>
                  {t("passwords_no_match")}
                </p>
              )}
              {error == 2 && (
                <p className={styles.formParagraph}>
                  {t("bad_current_password")}
                </p>
              )}
            </span>
          )}
        </form>
      )}
    </div>
  );
};
