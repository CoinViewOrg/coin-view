import { LoginForm } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";
import { authOptions } from "./api/auth/[...nextauth]";

const Login: NextPage = () => {
  return (
    <div className={styles.container}>
      <LoginForm />
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
  const session = await getSession({ req });

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
