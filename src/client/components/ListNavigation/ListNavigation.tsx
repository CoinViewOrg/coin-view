import { Button } from "../Button";

type PropsType = {
  page: number;
  prevPage: () => void;
  nextPage: () => void;
};

export const ListNavigation = ({ nextPage, page, prevPage }: PropsType) => {
  return (
    <div>
      {page !== 0 && <Button onClick={prevPage}>Previous page</Button>}
      <Button onClick={nextPage}>Next page</Button>
    </div>
  );
};
