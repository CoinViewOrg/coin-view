import { LoginForm } from "@coin-view/client";
import type { NextPage } from "next";
import React from "react";
import styles from "../styles/Home.module.css";

const Health: NextPage = (props) => {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default Health;
