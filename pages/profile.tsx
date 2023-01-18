import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { useContext } from "react";
import styles from "../styles/Profile.module.css";
import { useCustomTranslation } from "@coin-view/client";
import {
  getMarketImageSrc,
  MarketType,
  MARKET_NAMES,
} from "@coin-view/markets";
import Image from "next/image";
import cx from "classnames";
import { getFavoriteMarket } from "@coin-view/api";
import { AppContext } from "@coin-view/context";

const Profile: NextPage = (props) => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();

  const { favoriteMarketName } = useContext(AppContext);

  const [selectedMarket, setSelectedMarket] = React.useState<MarketType | null>(
    favoriteMarketName
  );

  const setNewMarket = React.useCallback(
    async (market: MarketType) => {
      setSelectedMarket(market);
      const response = await fetch(`/api/favorite_market?market=${market}`);

      const json = (await response.json()) as any;

      const { error, favoriteMarketName } = json;

      if (error || favoriteMarketName === null) {
        setSelectedMarket(null);
      }
    },
    [setSelectedMarket]
  );

  return (
    <div className={styles.container}>
      {session ? (
        <>
          <h2>
            {t("logged_in_header")} {session.user?.name}
          </h2>
          <p>{t("logged_in_paragraph")}</p>

          <div className={styles.settings}>
            <div className={styles.settingsItem}>
              <p>{t("favorite_market")}</p>
              <div className={styles.marketOptions}>
                {MARKET_NAMES.map((marketName) => (
                  <div
                    key={marketName}
                    className={cx(styles.marketOption, {
                      [styles.selected]: selectedMarket === marketName,
                    })}
                    onClick={() => setNewMarket(marketName)}
                  >
                    <Image
                      width={48}
                      height={48}
                      src={getMarketImageSrc(marketName)}
                    />{" "}
                    <span>{marketName.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <Link href="/login">{t("logged_in_redirect_login")}</Link>
      )}
    </div>
  );
};

export default Profile;

export async function getServerSideProps({
  req,
  res,
  locale,
}: {
  req: any;
  res: any;
  locale: string;
}) {
  const session = await getSession({ req });

  let favoriteMarket = null;

  if (session) {
    // @ts-ignore
    const userid = session?.user?.id;
    favoriteMarket = await getFavoriteMarket(userid);
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      favoriteMarketName: favoriteMarket.MarketName,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
