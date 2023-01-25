import { getMarketImageSrc, MarketType } from "@coin-view/markets";
import React from "react";
import styles from "./MarketButton.module.css";
import cx from "classnames";
import Image from "next/image";

type PropsType = {
  marketName: MarketType;
  selected?: boolean;
  onClick?: (market: MarketType) => void;
  size?: number;
  caption?: string;
  className?: string;
};

export const MarketButton = ({
  marketName,
  selected,
  onClick,
  size = 48,
  caption,
  className,
}: PropsType) => {
  const handleClick = React.useCallback(
    () => onClick?.(marketName),
    [onClick, marketName]
  );

  return (
    <div
      className={cx(styles.marketOption, className, {
        [styles.selected]: selected,
      })}
      onClick={handleClick}
    >
      {caption && <span>{caption}</span>}
      <Image
        width={size}
        height={size}
        src={getMarketImageSrc(marketName)}
        alt={marketName}
      />
      <span>{marketName.toLowerCase()}</span>
    </div>
  );
};
