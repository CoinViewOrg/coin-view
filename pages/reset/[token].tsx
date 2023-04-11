import { PasswordResetForm, useCustomTranslation } from "@coin-view/client";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import styles from "../../styles/Home.module.css";
import { checkResetToken } from "src";
import { useRouter } from "next/router";

const ResetPage: NextPage<{ token: string; validatedToken: boolean }> = ({
  token,
  validatedToken,
}) => {
  const { t, language } = useCustomTranslation();

  const [resetError, setResetError] = React.useState();
  const { push, locale } = useRouter();

  const handleSubmit = React.useCallback(
    async ({
      newPassword,
      repeatNewPassword,
    }: {
      newPassword?: string;
      repeatNewPassword?: string;
    }) => {
      const response = await fetch("/api/auth/resetpassword", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          repeatNewPassword,
        }),
      });
      const { error } = await response.json();

      if (error) {
        setResetError(error);
      } else {
        push(`/login?passr=1`, undefined, { locale: language });
      }
    },
    [language, push, token]
  );

  return (
    <div className={styles.container}>
      {validatedToken ? (
        <PasswordResetForm onSubmit={handleSubmit} error={resetError} />
      ) : (
        <p>{t("bad_token")}</p>
      )}
    </div>
  );
};

export default ResetPage;

export async function getServerSideProps({
  query,
  locale,
}: {
  query: any;
  locale: string;
}) {
  const token = query?.token!;
  const validatedToken = await checkResetToken(token);
  return {
    props: {
      token,
      validatedToken,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
