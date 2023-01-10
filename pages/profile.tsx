import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";
import styles from "../styles/Profile.module.css";
import { useCustomTranslation } from "@coin-view/client";

const Profile: NextPage = (props) => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      {session ? (
        <>
          <h1>{t("logged_in_header")}</h1>
          <p>{t("logged_in_paragraph")}</p>
        </>
      ) : (
        <Link href="/login">{t("logged_in_redirect_login")}</Link>
      )}
    </div>
  );
};

export default Profile;

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
