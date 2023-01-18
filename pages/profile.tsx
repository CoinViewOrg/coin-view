import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React from "react";
import styles from "../styles/Profile.module.css";
import { useCustomTranslation } from "@coin-view/client";
import { getMarketImageSrc, MarketType, MARKET_NAMES } from "@coin-view/utils";
import Image from "next/image";
import cx from "classnames";

const Profile: NextPage = (props) => {
  const { t } = useCustomTranslation();
  const { data: session, status } = useSession();

  const [selectedMarket, setSelectedMarket] =
    React.useState<MarketType>("BINANCE");

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
                {MARKET_NAMES.map((market) => (
                  <div
                    className={cx(styles.marketOption, {
                      [styles.selected]: selectedMarket === market,
                    })}
                    onClick={() => setSelectedMarket(market)}
                  >
                    <Image
                      width={48}
                      height={48}
                      src={getMarketImageSrc(market)}
                    />{" "}
                    <span>{market.toLowerCase()}</span>
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

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
