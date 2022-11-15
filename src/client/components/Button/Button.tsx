import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface PropsType extends React.HTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, ...props }: PropsType) => {
  return (
    <button className={styles.button} {...props}>
      {children}
    </button>
  );
};
