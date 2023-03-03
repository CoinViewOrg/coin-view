import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button";
import styles from "./Form.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { GoogleButton } from "../GoogleButton";
import { signIn } from "next-auth/react";
import { setCookie } from "@coin-view/utils";

export const RegisterForm = () => {
  const { t, language } = useCustomTranslation();
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const [error, setError] = React.useState();

  const { push, locale } = useRouter();

  const checkPasswordValidity = React.useCallback(() => {
    const password = passwordRef.current?.value;
    const confirmpassword = confirmPasswordRef.current?.value;
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

      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
      const email = emailRef.current?.value;

      const response = await fetch("/api/auth/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          username,
          email,
        }),
      });

      const { error } = await response.json();

      if (error) {
        setError(error);
      } else {
        push(`/login?registered=1`, undefined, { locale: language });
      }
    },
    [passwordRef, emailRef, push, language]
  );

  const googleSSO = React.useCallback(async () => {
    setCookie("locale", locale || "en", 1);
    await signIn("google", {
      callbackUrl: "/list",
    });
  }, [locale]);

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
          required
          ref={confirmPasswordRef}
          onChange={checkPasswordValidity}
        />
      </div>

      <input className={styles.formSubmit} type="submit" value="Create" />

      <Link href="/login">{t("register_form_redirect_login")}</Link>
      {error && (
        <span className={styles.error}>
          {error == 1 && "Please correct your credentials!"}
          {error == 2 && "User with given username or email already exists!"}
        </span>
      )}
    </form>
  );
};
