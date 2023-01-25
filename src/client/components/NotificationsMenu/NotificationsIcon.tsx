import { SVGProps } from "react";

interface PropsType extends SVGProps<SVGElement> {}

export const NotificationsIcon = (props: PropsType) => {
  return (
    <svg
      viewBox="0 0 256 256"
      width={props.width}
      height={props.height}
      className={props.className}
      onClick={props.onClick}
    >
      <rect width="100" height="80" fill="none"/>
      <path d="M221,175.9c-5.9-10.2-13-29.6-13-63.9v-7.1c0-44.3-35.6-80.6-79.4
      -80.9H128a79.9,79.9,0,0,0-80,80v8c0,34.3-7.1,53.7-13,63.9a15.8,15.8,0,0,0-.1,16.1,15.9,
      15.9,0,0,0,13.9,8H207.2a15.9,15.9,0,0,0,13.9-8A15.8,15.8,0,0,0,221,175.9Z"/>
      <path d="M159.9,216h-64a8,8,0,1,0,0,16h64a8,8,0,0,0,0-16Z"/>
    </svg>
  );
};
