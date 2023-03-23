import { useRouter } from "next/router";
import React, { useContext } from "react";
import { HamburgerIcon } from "./HamburgerIcon";
import styles from "./HamburgerMenu.module.css";
import cx from "classnames";
import { CurrencyToggler } from "../CurrencyToggler";
import Image from "next/future/image";
import { signOut, useSession } from "next-auth/react";
import { useCustomTranslation } from "@coin-view/client";
import { AppContext } from "@coin-view/context";

type PropsType = {
  toggleCurrency: () => void;
  onOpenCallback: () => void;
  toggleDarkMode: () => void;
};

export const HamburgerMenu = ({
  toggleCurrency,
  onOpenCallback,
  toggleDarkMode,
}: PropsType) => {
  const { push, pathname, replace } = useRouter();
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();

  const { language } = useCustomTranslation();
  const secondLanguage = language === "pl" ? "en" : "pl";

  const toggleLanguage = React.useCallback(() => {
    replace(pathname, undefined, {
      locale: secondLanguage,
    });
  }, [secondLanguage, pathname, replace]);

  const { hamburgerMenuOpen: menuOpen, colorTheme } =
    React.useContext(AppContext);

  const moonIconMode = React.useMemo(
    () => (colorTheme === "dark" ? "filled" : "empty"),
    [colorTheme]
  );

  return (
    <div className={styles.menu}>
      <Image
        src={"/menu.svg"}
        width={32}
        height={32}
        className={cx("svg-adaptive", styles.hamburger)}
        onClick={onOpenCallback}
        alt={"menu"}
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
            <span>{t("language")}:</span>
            <span
              className={cx({
                [styles.active]: language === "en",
              })}
            >
              EN
            </span>
            <span>/</span>
            <span
              className={cx({
                [styles.active]: language === "pl",
              })}
            >
              PL
            </span>
          </div>
          <div className={cx(styles.menuItem)} onClick={toggleDarkMode}>
            <Image
              className={cx("svg-adaptive", styles.menuIcon)}
              src={`/moon-${moonIconMode}.svg`}
              width={30}
              height={30}
              alt="Dark mode"
            />
            <span>{t("dark_mode")}</span>
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
                  {t("login")}
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
                  {t("register")}
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
                <span className={styles.overflowSpan}>
                  {session.user?.name}
                </span>
              </div>
              <div className={styles.menuItem} onClick={() => signOut()}>
                <Image
                  className={cx("svg-adaptive", styles.menuIcon)}
                  src="/logout.svg"
                  width={30}
                  height={30}
                  alt="logout"
                />
                <span>{t("sign_out")}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
