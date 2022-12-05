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

          <div className={styles.menuItem} onClick={() => push("/login")}>
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
          </div>
          <div className={styles.menuItem} onClick={() => push("/register")}>
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
          </div>
        </div>
      )}
    </div>
  );
};
