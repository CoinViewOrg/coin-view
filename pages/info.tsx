import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";

const Info: NextPage = () => {
  const { query } = useRouter();
  return (
    <div className={styles.container}>
      <h2>{query.message}</h2>
      <Link href="/">Go to main page.</Link>
    </div>
  );
};

export default Info;
