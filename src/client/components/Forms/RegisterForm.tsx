import Link from "next/link";
import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { GoogleButton } from "../GoogleButton";

type PropsType = {
  register: (props: {
    password?: string;
    username?: string;
    email?: string;
  }) => void;
  ssoRegister: () => void;
  error?: number;
};
export const RegisterForm = ({ register, ssoRegister, error }: PropsType) => {
  const { t, language } = useCustomTranslation();
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const checkPasswordValidity = React.useCallback(() => {
    const password = passwordRef.current?.value.trim();
    const confirmpassword = confirmPasswordRef.current?.value.trim();
    if (password !== confirmpassword && confirmPasswordRef.current) {
      confirmPasswordRef.current?.setCustomValidity("Passwords don't match!");
    } else {
      confirmPasswordRef.current?.setCustomValidity("");
    }
  }, [passwordRef, confirmPasswordRef]);

  const submitForm = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }

      const username = usernameRef.current?.value.trim();
      const password = passwordRef.current?.value.trim();
      const email = emailRef.current?.value.trim();

      register({ username, password, email });
    },
    [register, passwordRef, usernameRef, emailRef]
  );

  const googleSSO = React.useCallback(async () => {
    ssoRegister();
  }, [ssoRegister]);

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>{t("register_form_header")}</h2>
      <GoogleButton onClick={googleSSO} />
      <hr></hr>
      <div className={styles.formItem}>
        <label htmlFor="username">{t("register_form_username")}</label>
        <input
          id="username"
          type="username"
          name="username"
          pattern="[A-Za-z0-9._\S]{3,30}\w$"
          maxLength={30}
          required
          ref={usernameRef}
        />
      </div>

      <div className={styles.formItem}>
        <label htmlFor="email">{t("register_form_email")}</label>
        <input
          id="email"
          type="email"
          name="email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          required
          ref={emailRef}
        />
      </div>

      <div className={styles.formItem}>
        <label htmlFor="password">{t("register_form_password")}</label>
        <input
          id="password"
          type="password"
          name="password"
          maxLength={40}
          minLength={6}
          required
          ref={passwordRef}
        />
      </div>

      <div className={styles.formItem}>
        <label htmlFor="confirmpassword">
          {t("register_form_password_confirm")}
        </label>
        <input
          id="confirmpassword"
          type="password"
          name="confirmpassword"
          maxLength={40}
          required
          ref={confirmPasswordRef}
          onChange={checkPasswordValidity}
        />
      </div>

      <input className={styles.formSubmit} type="submit" value="Create" />

      <Link href="/login">{t("register_form_redirect_login")}</Link>
      {error && (
        <span className={styles.error}>
          {error == 1 && (
            <p className={styles.formParagraph}>{t("wrong_credentials")}</p>
          )}
          {error == 2 && (
            <p className={styles.formParagraph}>{t("user_already_exists")}</p>
          )}
        </span>
      )}
    </form>
  );
};
