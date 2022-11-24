import React from "react";

const AUTO_REFRESH = 1000 * 60;

export const useAutoRefresh = (refresh: (showLoading: boolean) => void) => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        refresh(false);
      }
    }, AUTO_REFRESH);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);
};
