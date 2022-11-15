import React from "react";

export const usePaging = () => {
  const [page, setPage] = React.useState(0);

  const nextPage = React.useCallback(() => setPage((p) => p + 1), []);
  const prevPage = React.useCallback(() => setPage((p) => p - 1), []);

  return {
    page,
    nextPage,
    prevPage,
  };
};
