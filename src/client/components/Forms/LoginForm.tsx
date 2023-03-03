import Link from "next/link";
import React from "react";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { GoogleButton } from "../GoogleButton";
import { setCookie } from "@coin-view/utils";

const GOOGLE_SSO_ERRORS = new Map([["1", "email_already_used"]]);

const getGoogleSSOErrorMessage = (code: number | string | string[]) => {
  return GOOGLE_SSO_ERRORS.get(String(code)) || "gemeric_sso_error";
};

export const LoginForm = () => {
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const { t, language } = useCustomTranslation();

  const { query, push, locale } = useRouter();

  const [error, setError] = React.useState(false);

  const { registered, google_sso_error } = query;

  const submitForm = React.useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }

      const password = passwordRef.current?.value;
      const username = usernameRef.current?.value;

      if (!username || !password) {
        return;
      }

      const response = await signIn("credentials", {
        password,
        username,
        redirect: false,
        callbackUrl: "/list",
      });

      if (response?.error) {
        setError(true);
      }

      if (response?.url) {
        push(response.url, undefined, {
          locale: language,
        });
      }
    },
    [passwordRef, push, language]
  );

  const googleSSO = React.useCallback(async () => {
    setCookie("locale", locale || "en", 1);
    await signIn("google", {
      callbackUrl: "/list",
    });
  }, [locale]);
  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>{t("login_form_header")}</h2>
      <GoogleButton onClick={googleSSO} />
      {google_sso_error && (
        <span className={styles.error}>
          {t(getGoogleSSOErrorMessage(google_sso_error))}
        </span>
      )}
      <hr></hr>
      <div className={styles.formItem}>
        <label htmlFor="username">{t("login_form_username")}</label>
        <input
          id="username"
          type="username"
          name="username"
          required
          ref={usernameRef}
        />
      </div>
      <div className={styles.formItem}>
        <label htmlFor="password">{t("login_form_password")}</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          ref={passwordRef}
        />
      </div>

      <input className={styles.formSubmit} type="submit" value="Login" />

      <Link href="/register">{t("login_form_redirect_register")}</Link>
      {error && <span className={styles.error}>{t("login_form_invalid")}</span>}
      {registered && (
        <span className={styles.success}>
          {t("login_form_register_succesful_1")} <br></br>{" "}
          {t("login_form_register_succesful_2")}
        </span>
      )}
    </form>
  );
};
