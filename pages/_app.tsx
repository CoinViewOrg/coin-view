import "../styles/globals.scss";
import "../styles/fonts.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import Head from "next/head";
import {
  CurrencyToggler,
  HamburgerMenu,
  useCurrencyToggle,
  NotificationsMenu,
} from "@coin-view/client";
import styles from "../styles/App.module.css";
import { useRouter } from "next/router";
import React from "react";
import { AppContext, ColorTheme, defaultCurrency } from "@coin-view/context";
import Image from "next/future/image";
import { CoinListItem } from "@coin-view/types";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { appWithTranslation } from "next-i18next";
import { MarketType } from "@coin-view/markets";

const GTM_ID = "G-R8PPSMRFS0";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  data: CoinListItem[];
  meta: any;
  session: Session;
  favorites?: number[] | null;
  favoriteMarketName: MarketType | null;
}>) {
  const { currency, toggleCurrency } = useCurrencyToggle(defaultCurrency);
  const [notificationsMenuOpen, setNotificationsMenuOpen] =
    React.useState(false);
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = React.useState(false);
  const { push } = useRouter();

  const openHamburger = React.useCallback(() => {
    setHamburgerMenuOpen((open) => !open);
    setNotificationsMenuOpen(false);
  }, []);

  const openNotifications = React.useCallback(() => {
    setNotificationsMenuOpen((open) => !open);
    setHamburgerMenuOpen(false);
  }, []);

  const fetchNotifcations = React.useCallback(async () => {
    const response = await fetch("/api/notifications?param=fetch");
    const { error, notifications } = await response.json();
    return notifications;
  }, []);

  /**
   * @todo
   * move state, toggler and useEffect to a separate hook
   */
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>("dark");

  const toggleDarkMode = React.useCallback(
    () => setColorTheme((theme) => (theme === "dark" ? "light" : "dark")),
    []
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorTheme);
    if (pageProps.session) {
      const response = fetch("/api/notifications?param=count")
        .then((response) => response.json())
        .then((json) => {
          const { error, notifications } = json;
          setNotificationsCount(notifications[0].count);
        });
    }
  }, [colorTheme, pageProps.session]);

  return (
    <>
      <Head>
        <title>Coin View</title>
        <meta
          name="description"
          content="Welcome to our website! Here we specialize in listing the best cryptocurrencies and tokens available in the market today. Our experts review each cryptocurrency carefully to ensure it meets our standards for quality, security, and credibility. We provide up-to-date pricing information, detailed charts, and informative reviews so that you can make an informed decision when selecting your next investment. Whether you're looking for long-term investments or just wanting to diversify your portfolio, you can trust us to provide you with the best options available."
        />
        <meta
          name="keywords"
          content="cryptocurrency, tokens, investments, portfolio, pricing, charts, reviews, long-term, diversify"
        />
        <meta name="author" content="Karol Rzotki" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `}
      </Script>
      <SessionProvider session={pageProps.session}>
        <AppContext.Provider
          value={{
            currency,
            favorites: pageProps.favorites || [],
            notificationsMenuOpen,
            hamburgerMenuOpen,
            favoriteMarketName: pageProps.favoriteMarketName,
            colorTheme,
          }}
        >
          <div className={styles.container}>
            <header className={styles.header}>
              <NotificationsMenu
                onOpenCallback={openNotifications}
                notificationsCount={notificationsCount}
                fetchNotifications={fetchNotifcations}
              />
              <HamburgerMenu
                onOpenCallback={openHamburger}
                toggleCurrency={toggleCurrency}
                toggleDarkMode={toggleDarkMode}
              />
            </header>
            <main className={styles.main}>
              <div className={styles.mainLogo} onClick={() => push("/list")}>
                <div className={styles.logoContainer}>
                  <Image
                    src={`/logo-${colorTheme}.png`}
                    alt="logo"
                    fill
                    sizes="15 vmin"
                  />
                </div>
                <h1 className={styles.title}>Coin View</h1>
              </div>
              <Component {...pageProps} />
            </main>
            <footer className={styles.footer}>CoinView®</footer>
          </div>
        </AppContext.Provider>
      </SessionProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
