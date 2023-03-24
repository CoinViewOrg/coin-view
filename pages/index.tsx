import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";
import { createOptions } from "./api/auth/[...nextauth]";

const Index: NextPage = (props) => {
  const { replace } = useRouter();
  React.useEffect(() => {
    //navigate to list on client side to reduce API calls
    replace("/list");
  }, [replace]);

  return <div className={styles.container}></div>;
};

export default Index;

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
