import { ReactElement } from "react";

const BackButton = ({
  text,
  onButtonClick,
  className,
}: {
  text: string;
  onButtonClick: () => void;
  className?: string;
}): ReactElement => (
  <div
    className={`justify-center rounded pt-6 pb-8 mb-4 flex ${className}`}
    onClick={onButtonClick}>
    <svg
      className="w-7 h-7 mt-1 text-gray-800 group-hover/box:bg-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 8 14">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
      />
      {text}
    </svg>

    <button className="inline-block align-baseline font-bold text-2xl">
      {text}
    </button>
  </div>
);

export default BackButton;
