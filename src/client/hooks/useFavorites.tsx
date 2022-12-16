import { AppContext } from "@coin-view/context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const useFavorites = () => {
  const { favorites } = React.useContext(AppContext);

  const [allFavorites, setAllFavorites] = React.useState(favorites);

  const { status } = useSession();

  const { push } = useRouter();

  const addToFavorites = React.useCallback(
    async (evt: any, cryptoId: number) => {
      evt.stopPropagation();

      if (status === "unauthenticated") {
        push("/login");
        return;
      }

      const response = await fetch(`/api/favorite?id=${cryptoId}`);

      const { error, isFavorite } = await response.json();

      const newFavorites = [...(allFavorites || [])];
      if (isFavorite && !newFavorites.includes(cryptoId)) {
        newFavorites.push(cryptoId);
      }

      if (!isFavorite && newFavorites.includes(cryptoId)) {
        const index = newFavorites.findIndex((item) => item === cryptoId);
        newFavorites.splice(index, 1);
      }

      setAllFavorites(newFavorites);
    },
    [allFavorites, push, status]
  );

  return {
    favorites: allFavorites,
    addToFavorites,
  };
};
