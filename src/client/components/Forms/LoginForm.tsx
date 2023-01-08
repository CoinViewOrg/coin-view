import Link from "next/link";
import React from "react";
import styles from "./Form.module.css";

import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const LoginForm = () => {
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);

  const { query } = useRouter();

  const { error, registered } = query;

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

      signIn("credentials", {
        password,
        username,
        redirect: true,
        callbackUrl: "/list",
      });
    },
    [passwordRef]
  );

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>Log in to your account</h2>
      <div className={styles.formItem}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="username"
          name="username"
          required
          ref={usernameRef}
        />
      </div>
      <div className={styles.formItem}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          ref={passwordRef}
        />
      </div>

      <input className={styles.formSubmit} type="submit" value="Login" />

      <Link href="/register">Do not have an account? Create one!</Link>
      {error && (
        <span className={styles.error}>Invalid username or password!</span>
      )}
      {registered && (
        <span className={styles.success}>
          You have successfully created a new account! <br></br> You can log in
          now.
        </span>
      )}
    </form>
  );
};
