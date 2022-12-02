import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import styles from "../styles/Search.module.css";

const Search: NextPage = (props) => {
  const { query } = useRouter();
  const phrase = query.phrase as string;
  return <div className={styles.container}>{phrase}</div>;
};

export default Search;
