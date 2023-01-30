import { querySQL } from "@coin-view/api";
import { useCustomTranslation } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import { authOptions } from "./api/auth/[...nextauth]";

const VerifyEmail: NextPage<{ message: string }> = (props) => {
  const { t } = useCustomTranslation();
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
  res,
  locale,
}: {
  query: NextApiRequestQuery;
  req: any;
  res: any;
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

  const session = await unstable_getServerSession(req, res, authOptions);
  return {
    props: {
      message,
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default VerifyEmail;
