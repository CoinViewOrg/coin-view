import { querySQL } from "@coin-view/api";
import type { NextPage } from "next";
import { NextApiRequestQuery } from "next/dist/server/api-utils";
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";

const VerifyEmail: NextPage<{ message: string }> = (props) => {
  return (
    <div className={styles.container}>
      <h2>{props.message}</h2>
      <Link href="/">Go to main page.</Link>
    </div>
  );
};

export async function getServerSideProps({
  query,
  req,
}: {
  query: NextApiRequestQuery;
  req: any;
}) {
  const requestId = query.requestid;
  let response;

  const verifySql = `UPDATE UsrAccount SET EmailVerified = 1 WHERE VerificationId='${requestId}'`;
  response = (await querySQL(verifySql)) as any;

  let message = "Invalid request id!";

  if (response.changedRows > 0) {
    message = "Successfully verified!";
  } else if (response.affectedRows > 0) {
    message = "Email already verified!";
  }

  return {
    props: {
      message,
    },
  };
}

export default VerifyEmail;
