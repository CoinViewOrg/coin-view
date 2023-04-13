import { RecoveryForm } from "@coin-view/client";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const Recovery: NextPage<{ locale: string }> = (props) => {
  const { push } = useRouter();

  const [recoveryError, setRecoveryError] = React.useState();

  const handleSubmit = React.useCallback(
    async ({ usernameOrEmail }: { usernameOrEmail?: string }) => {
      const response = await fetch("/api/setrecoveryrequest", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrEmail,
        }),
      });

      const { error } = await response.json();

      if (error) {
        setRecoveryError(error);
      } else {
        push(`/login?recoveryrequest=1`, undefined, { locale: props.locale });
      }
    },
    [push, props.locale]
  );
  return (
    <div className={styles.container}>
      <RecoveryForm onSubmit={handleSubmit} error={recoveryError} />
    </div>
  );
};

export default Recovery;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
