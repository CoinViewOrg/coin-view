import { useRouter } from "next/router";
import React from "react";
import { HamburgerIcon } from "./HamburgerIcon";
import styles from "./HamburgerMenu.module.css";
import cx from "classnames";
import { CurrencyToggler } from "../CurrencyToggler";
import Image from "next/future/image";
import { signOut, useSession } from "next-auth/react";

type PropsType = {
  toggleCurrency: () => void;
};

export const HamburgerMenu = ({ toggleCurrency }: PropsType) => {
  const { push, pathname, replace, locale } = useRouter();

  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const secondLanguage = locale === "pl" ? "en" : "pl";

  const toggleLanguage = React.useCallback(() => {
    replace(pathname, undefined, { locale: secondLanguage });
  }, [secondLanguage, locale]);

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
          <div
            className={cx(styles.menuItem, styles.language)}
            onClick={toggleLanguage}
          >
            <Image
              className={cx("svg-adaptive", styles.menuIcon)}
              src="/language.svg"
              width={30}
              height={30}
              alt="language"
            />
            <span>Language:</span>
            <span
              className={cx({
                [styles.active]: locale === "en",
              })}
            >
              EN
            </span>
            <span>/</span>
            <span
              className={cx({
                [styles.active]: locale === "pl",
              })}
            >
              PL
            </span>
          </div>
          {status !== "authenticated" ? (
            <>
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
              <div
                className={styles.menuItem}
                onClick={() => push("/register")}
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
              </div>
            </>
          ) : (
            <>
              <div className={styles.menuItem} onClick={() => push("/profile")}>
                <Image
                  className={cx("svg-adaptive", styles.menuIcon)}
                  src="/profile.svg"
                  width={30}
                  height={30}
                  alt="profile"
                />
                <span>{session.user?.name}</span>
              </div>
              <div className={styles.menuItem} onClick={() => signOut()}>
                <Image
                  className={cx("svg-adaptive", styles.menuIcon)}
                  src="/logout.svg"
                  width={30}
                  height={30}
                  alt="logout"
                />
                <span>Sign out</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
