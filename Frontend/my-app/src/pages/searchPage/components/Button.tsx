import { ReactElement } from "react";
import MemberIcon from "@rsuite/icons/Member";
import ArrowRightIcon from "@rsuite/icons/ArrowRight";

export const BUTTON_ICONS = {
  MEMBER: "member",
  CLOSE: "close",
};

const ICON_MAP = {
  [BUTTON_ICONS.CLOSE]: (
    <ArrowRightIcon className="text-white group-hover/box:text-blue-800 w-6 h-6" />
  ),
  [BUTTON_ICONS.MEMBER]: (
    <MemberIcon className="text-white group-hover/box:text-blue-800" />
  ),
};

export const Button = ({
  handleClick,
  className,
  textClassName,
  icon,
  text,
}: {
  handleClick: () => void;
  className: string;
  textClassName: string;
  icon: string;
  text: string;
}): ReactElement => {
  return (
    <>
      <button
        className={`shadow-sm flex justify-center items-center rounded-md group/box bg-blue-500 hover:bg-slate-200 hover:drop-shadow-sm ${className}`}
        onClick={handleClick}>
        <p
          className={`group-hover/box:text-blue-800 text-white className ${textClassName}`}>
          {text}
        </p>
        {ICON_MAP[icon]}
      </button>
    </>
  );
};
