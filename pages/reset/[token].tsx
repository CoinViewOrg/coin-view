import { PasswordResetForm, useCustomTranslation } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]";
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
  req,
  res,
  locale,
}: {
  query: any;
  req: any;
  res: any;
  locale: string;
}) {
  const token = query?.token!;
  const session = await unstable_getServerSession(req, res, authOptions);
  const validatedToken = await checkResetToken(token);
  return {
    props: {
      token,
      validatedToken,
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
