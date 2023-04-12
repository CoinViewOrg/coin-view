import { LoginForm } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";
import { createOptions } from "./api/auth/[...nextauth]";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { setCookie } from "@coin-view/utils";
import { useCustomTranslation } from "@coin-view/client";

const Login: NextPage = () => {
  const { query, push, locale } = useRouter();

  const { t, language } = useCustomTranslation();
  const [signInError, setSignInError] = React.useState(false);

  const { passr, recoveryrequest, registered, google_sso_error } = query;

  const handleSignIn = React.useCallback(
    async ({
      username,
      password,
    }: {
      username?: string;
      password?: string;
    }) => {
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
        setSignInError(true);
      }

      if (response?.url) {
        push(response.url, undefined, {
          locale: language,
        });
      }
    },
    [language, push]
  );

  const handleSSOSignIn = React.useCallback(async () => {
    setCookie("locale", locale || "en", 1);
    await signIn("google", {
      callbackUrl: "/list",
    });
  }, [locale]);

  return (
    <div className={styles.container}>
      <LoginForm
        nextSignIn={handleSignIn}
        ssoSignIn={handleSSOSignIn}
        passr={passr}
        recoveryRequest={recoveryrequest}
        registered={registered}
        googleSSOError={google_sso_error}
        error={signInError}
      />
    </div>
  );
};

export default Login;

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
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
