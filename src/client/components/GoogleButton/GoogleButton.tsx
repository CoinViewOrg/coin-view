import { useCustomTranslation } from "@coin-view/client";
import css from "./GoogleButton.module.css";
import Image from "next/image";

type PropsType = {
  onClick: () => void;
};

export const GoogleButton = ({ onClick }: PropsType) => {
  const { t } = useCustomTranslation();
  return (
    <div className={css.button} onClick={onClick}>
      <Image src="/google.svg" width={32} height={32} /> {t("google_sign_in")}
    </div>
  );
};
