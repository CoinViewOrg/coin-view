import { RegisterForm } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";
import { createOptions } from "./api/auth/[...nextauth]";

const Register: NextPage = (props) => {
  return (
    <div className={styles.container}>
      <RegisterForm />
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
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
