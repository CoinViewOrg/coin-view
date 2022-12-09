import { SVGProps } from "react";

interface PropsType extends SVGProps<SVGElement> {}

export const HamburgerIcon = (props: PropsType) => {
  return (
    <svg
      viewBox="0 0 100 80"
      width={props.width}
      height={props.height}
      className={props.className}
      onClick={props.onClick}
    >
      <rect width="100" height="20" rx="8"></rect>
      <rect y="30" width="100" height="20" rx="8"></rect>
      <rect y="60" width="100" height="20" rx="8"></rect>
    </svg>
  );
};
