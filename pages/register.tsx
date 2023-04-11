import { RegisterForm } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";
import { createOptions } from "./api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { setCookie } from "@coin-view/utils";

const Register: NextPage<{ locale: string }> = (props) => {
  const [registerError, setRegisterError] = React.useState();

  const { push, locale } = useRouter();

  const handleRegister = React.useCallback(
    async ({
      password,
      username,
      email,
    }: {
      password?: string;
      username?: string;
      email?: string;
    }) => {
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
        setRegisterError(error);
      } else {
        push(`/login?registered=1`, undefined, { locale: props.locale });
      }
    },
    [push, props.locale]
  );

  const handleSSORegister = React.useCallback(async () => {
    setCookie("locale", locale || "en", 1);
    await signIn("google", {
      callbackUrl: "/list",
    });
  }, [locale]);

  return (
    <div className={styles.container}>
      <RegisterForm
        register={handleRegister}
        ssoRegister={handleSSORegister}
        error={registerError}
      />
    </div>
  );
};

export default Register;

export async function getServerSideProps({
  req,
  res,
  locale,
}: {
  req: any;
  res: any;
  locale: string;
}) {
  const session = await unstable_getServerSession(req, res, createOptions(req));

  return {
    props: {
      locale: locale,
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
