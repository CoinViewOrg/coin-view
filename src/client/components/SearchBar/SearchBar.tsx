import { useRouter } from "next/router";
import React from "react";
import { Button } from "../Button";
import styles from "./SearchBar.module.css";

type PropsType = {};

export const SearchBar = ({}: PropsType) => {
  const [phrase, setPhrase] = React.useState("");
  const { push } = useRouter();
  const searchPhrase = React.useCallback(() => {
    if (phrase.length) {
      push(`/search?phrase=${phrase}`);
    }
  }, [phrase, push]);

  const submitOnEnter = React.useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key === "Enter") {
        searchPhrase();
      }
    },
    [searchPhrase]
  );

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        onChange={(evt) => setPhrase(evt.target.value)}
        onKeyDown={submitOnEnter}
        value={phrase}
        placeholder="Find by name..."
      />
      <Button onClick={searchPhrase}>Search</Button>
    </div>
  );
};
