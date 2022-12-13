import { LoginForm } from "@coin-view/client";
import type { NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import React from "react";
import styles from "../styles/Home.module.css";
import { authOptions } from "./api/auth/[...nextauth]";

const Health: NextPage = () => {

  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
};

export default Health;