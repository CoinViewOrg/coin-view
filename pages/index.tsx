import type { NextPage } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";

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
  const session = await getSession({ req });

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
