import { RecoveryForm } from "@coin-view/client";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";

const Recovery: NextPage = () => {
  return (
    <div className={styles.container}>
      <RecoveryForm />
    </div>
  );
};

export default Recovery;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
