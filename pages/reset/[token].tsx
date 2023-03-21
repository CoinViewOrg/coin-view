import { PasswordResetForm, useCustomTranslation } from "@coin-view/client";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../../styles/Home.module.css";
import { checkResetToken } from "src";

const ResetPage: NextPage = ({
  token,
  validatedToken,
}: {
  token: string;
  validatedToken: boolean;
}) => {
  const { t, language } = useCustomTranslation();
  return (
    <div className={styles.container}>
      {validatedToken ? (
        <PasswordResetForm token={token} />
      ) : (
        <p>{t("bad_token")}</p>
      )}
    </div>
  );
};

export default ResetPage;

export async function getServerSideProps({
  query,
  locale,
}: {
  query: any;
  locale: string;
}) {
  const token = query?.token!;
  const validatedToken = await checkResetToken(token);
  return {
    props: {
      token,
      validatedToken,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
