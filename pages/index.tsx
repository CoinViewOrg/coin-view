import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Home.module.css";

const Index: NextPage = (props) => {
  const { replace } = useRouter();
  React.useEffect(() => {
    replace("/list");
  }, [replace]);

  return <div className={styles.container}></div>;
};

export default Index;
