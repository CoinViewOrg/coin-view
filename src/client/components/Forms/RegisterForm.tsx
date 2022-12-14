import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button";
import styles from "./Form.module.css";

export const RegisterForm = () => {
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmPasswordRef = React.useRef<HTMLInputElement>(null);

  const [error, setError] = React.useState();

  const { push } = useRouter();

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
        push(`/login?registered=1`);
      }
    },
    [passwordRef, emailRef, push]
  );

  return (
    <form className={styles.container} onSubmit={submitForm}>
      <h2>Create new account</h2>
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
          minLength={6}
          required
          ref={passwordRef}
        />
      </div>

      <div className={styles.formItem}>
        <label htmlFor="confirmpassword">Confirm password</label>
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

      <Link href="/login">Already have an account? Log in here!</Link>
      {error && (
        <span className={styles.error}>
          {error == 1 && "Please correct your credentials!"}
          {error == 2 && "User with given username or email already exists!"}
        </span>
      )}
    </form>
  );
};
