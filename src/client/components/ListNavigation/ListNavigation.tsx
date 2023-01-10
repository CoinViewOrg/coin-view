import { Button } from "../Button";
import { useCustomTranslation } from "@coin-view/client";

type PropsType = {
  page: number;
  prevPage: () => void;
  nextPage: () => void;
};

export const ListNavigation = ({ nextPage, page, prevPage }: PropsType) => {
  const { t } = useCustomTranslation();
  return (
    <div>
      {page !== 0 && <Button onClick={prevPage}>{t("prev_page")}</Button>}
      <Button onClick={nextPage}>{t("next_page")}</Button>
    </div>
  );
};
