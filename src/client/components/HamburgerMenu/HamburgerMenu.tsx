import { useRouter } from "next/router";
import React from "react";
import { HamburgerIcon } from "./HamburgerIcon";
import styles from "./HamburgerMenu.module.css";
import cx from "classnames";
import { CurrencyToggler } from "../CurrencyToggler";
import Image from "next/future/image";

type PropsType = {
  toggleCurrency: () => void;
};

export const HamburgerMenu = ({ toggleCurrency }: PropsType) => {
  const { push, pathname } = useRouter();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const navigate = React.useCallback(
    (evt: any, path: string) => {
      evt.preventDefault();
      push(path);
    },
    [push]
  );

  return (
    <div className={styles.menu}>
      <HamburgerIcon
        width={32}
        height={32}
        className={cx("svg-adaptive", styles.hamburger)}
        onClick={() => setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className={styles.menuContent}>
          <CurrencyToggler
            className={styles.menuItem}
            toggleCurrency={toggleCurrency}
          />

          <a
            href="/login"
            className={styles.menuItem}
            onClick={(evt) => navigate(evt, "/login")}
          >
            <Image
              className={cx("svg-adaptive", styles.menuIcon, {
                [styles.active]: pathname.includes("login"),
              })}
              src="/login.svg"
              width={30}
              height={30}
              alt="login"
            />
            <span
              className={cx({
                [styles.active]: pathname.includes("login"),
              })}
            >
              Login
            </span>
          </a>
          <a
            href="/register"
            className={styles.menuItem}
            onClick={(evt) => navigate(evt, "/register")}
          >
            <Image
              className={cx("svg-adaptive", styles.menuIcon)}
              src="/register.svg"
              width={30}
              height={30}
              alt="login"
            />
            <span
              className={cx({
                [styles.active]: pathname.includes("register"),
              })}
            >
              Register
            </span>
          </a>
        </div>
      )}
    </div>
  );
};
