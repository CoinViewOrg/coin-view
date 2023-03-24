import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import React, { useContext } from "react";
import styles from "../styles/Profile.module.css";
import {
  ChangePasswordForm,
  MarketButton,
  ModifyProfileForm,
  useCustomTranslation,
} from "@coin-view/client";
import { MarketType, MARKET_NAMES } from "@coin-view/markets";
import { getCryptothresholds, getFavoriteMarket } from "@coin-view/api";
import { AppContext } from "@coin-view/context";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

type PageProps = {
  userThreshold: number | null;
};

const Profile: NextPage<PageProps> = (props) => {
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
          <ModifyProfileForm threshold={props.userThreshold} />
          {!Boolean(session.user?.google_sso) && <ChangePasswordForm />}
          <div className={styles.settings}>
            <div className={styles.settingsItem}>
              <p>{t("favorite_market")}</p>
              <div className={styles.marketOptions}>
                {MARKET_NAMES.map((marketName) => (
                  <MarketButton
                    key={marketName}
                    marketName={marketName}
                    onClick={setNewMarket}
                    selected={selectedMarket === marketName}
                  />
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
  const session = await unstable_getServerSession(req, res, authOptions);

  let favoriteMarket = null;
  let userThreshold = null;

  const userid = session?.user?.id;

  if (userid) {
    favoriteMarket = await getFavoriteMarket(userid);
    userThreshold = await getCryptothresholds(userid);
  }

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      favoriteMarketName: favoriteMarket,
      userThreshold: userThreshold,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
