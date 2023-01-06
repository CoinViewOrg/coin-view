import { AppContext } from "@coin-view/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const useAlertThresholds = () => {
  const { thresholds } = React.useContext(AppContext);

  const [allThresholds, setAllThresholds] = React.useState(thresholds);

  const { status } = useSession();

  const { push } = useRouter();

  const setThreshold = React.useCallback(
    async (cryptoId: number, threshold: number) => {
      if (status === "unauthenticated") {
        push("/login");
        return;
      }

      const response = await fetch(
        `/api/threshold?id=${cryptoId}&threshold=${threshold}`
      );

      const { error, newthreshold } = await response.json();

      if (error === 2) {
        alert("Please confirm your email address first!");
      }

      if (!error) {
        setAllThresholds((current) => ({
          ...current,
          [cryptoId]: newthreshold,
        }));
      }
    },
    [push, status]
  );

  return {
    setThreshold,
    thresholds: allThresholds,
  };
};
