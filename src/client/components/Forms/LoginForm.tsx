import Link from "next/link";
import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { GoogleButton } from "../GoogleButton";

const GOOGLE_SSO_ERRORS = new Map([["1", "email_already_used"]]);

const getGoogleSSOErrorMessage = (code: number | string | string[]) => {
  return GOOGLE_SSO_ERRORS.get(String(code)) || "gemeric_sso_error";
};

type PropsType = {
  nextSignIn: (props: { username?: string; password?: string }) => void;
  ssoSignIn: () => void;
  passr?: string | string[];
  recoveryRequest?: string | string[];
  registered?: string | string[];
  googleSSOError?: string | string[];
  error?: boolean;
};

export const LoginForm = ({
  nextSignIn,
  ssoSignIn,
  passr,
  recoveryRequest,
  registered,
  googleSSOError,
  error,
}: PropsType) => {
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const { t, language } = useCustomTranslation();

  const submitForm = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }

      const password = passwordRef.current?.value.trim();
      const username = usernameRef.current?.value.trim();

      if (!username || !password) {
        return;
      }
      nextSignIn({ username, password });
    },
    [passwordRef, nextSignIn]
  );

  const googleSSO = React.useCallback(async () => {
    ssoSignIn();
  }, [ssoSignIn]);

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>{t("login_form_header")}</h2>
      <GoogleButton onClick={googleSSO} />
      {googleSSOError && (
        <span className={styles.error}>
          {t(getGoogleSSOErrorMessage(googleSSOError))}
        </span>
      )}
      <hr></hr>

      <div className={styles.formItem}>
        <label htmlFor="username">{t("login_form_username")}</label>
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
        <label htmlFor="password">{t("login_form_password")}</label>
        <div className={styles.formItemColumnWrapper}>
          <input
            id="password"
            type="password"
            name="password"
            maxLength={40}
            required
            ref={passwordRef}
          />
          <Link href="/recovery">{t("login_form_redirect_recovery")}</Link>
        </div>
      </div>

      <input className={styles.formSubmit} type="submit" value="Login" />

      <Link href="/register">{t("login_form_redirect_register")}</Link>
      {error && <span className={styles.error}>{t("login_form_invalid")}</span>}
      {registered && (
        <span className={styles.success}>
          <p className={styles.formParagraph}>
            {t("login_form_register_succesful_1")}
          </p>
          <p className={styles.formParagraph}>
            {t("login_form_register_succesful_2")}
          </p>
        </span>
      )}
      {recoveryRequest && (
        <span className={styles.success}>
          <p className={styles.formParagraph}>
            {t("login_form_recovery_succesful_1")}
          </p>
          <p className={styles.formParagraph}>
            {t("login_form_recovery_succesful_2")}
          </p>
        </span>
      )}
      {passr && (
        <span className={styles.success}>
          <p className={styles.formParagraph}>
            {t("password_reset_succesful")}
          </p>
        </span>
      )}
    </form>
  );
};
