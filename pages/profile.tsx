import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import styles from "../styles/Profile.module.css";

const Profile: NextPage = (props) => {
  const { data: session, status } = useSession();

  return (
    <div className={styles.container}>
      {session ? (
        <>
          <h1>Protected Page</h1>
          <p>You can view this page because you are signed in.</p>
        </>
      ) : (
        <Link href="/login">Please log in to see this page</Link>
      )}
    </div>
  );
};

export default Profile;

export async function getServerSideProps({ req, res }: { req: any; res: any }) {
  const session = await getSession({ req });

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}
