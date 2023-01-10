import { querySQL } from "@coin-view/api";
import { useCustomTranslation } from "@coin-view/client";
import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

const VerifyEmail: NextPage<{ message: string }> = (props) => {
  const { t } = useCustomTranslation();
//something is missing from {t(props.message)}
  return (
    <div className={styles.container}>
      <h2>{t(props.message)}</h2>
      <Link href="/">{t("verify_email_header")}</Link>
    </div>
  );
};

export async function getServerSideProps({
  query,
  req,
  locale,
}: {
  query: NextApiRequestQuery;
  req: any;
  locale: string;
}) {
  const requestId = query.requestid;
  let response;

  const verifySql = `UPDATE UsrAccount SET EmailVerified = 1 WHERE VerificationId='${requestId}'`;
  response = (await querySQL(verifySql)) as any;

  let message = "verify_invalid_request_id";

  if (response.changedRows > 0) {
    message = "verify_email_succesful";
  } else if (response.affectedRows > 0) {
    message = "verify_email_already";
  }

  const session = await getSession({ req });

  return {
    props: {
      message,
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default VerifyEmail;
