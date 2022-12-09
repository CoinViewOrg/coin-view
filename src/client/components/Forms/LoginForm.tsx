import Link from "next/link";
import React from "react";
import styles from "./Form.module.css";

export const LoginForm = () => {
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const submitForm = React.useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const form = evt.target as HTMLFormElement;
      if (!form.checkValidity()) {
        return;
      }

      const password = passwordRef.current?.value;
      const email = emailRef.current?.value;
    },
    [passwordRef.current, emailRef.current]
  );

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>Log in to your account</h2>
      <div className={styles.formItem}>
        <label htmlFor="email">E-mail address</label>
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

      <Link href="/register">Don't have an account? Create one!</Link>
    </form>
  );
};
