import { ReactElement } from "react";

const SearchButton = ({
  text,
  onButtonClick,
  className,
}: {
  text: string;
  onButtonClick: () => void;
  className?: string;
}): ReactElement => (
  <div
    className={`bg-grey border justify-center rounded px-8 pt-6 pb-8 mb-4 flex group/box shadow-sm hover:shadow-lg ${className}`}
    onClick={onButtonClick}>
    <button className="mt-2 inline-block font-medium align-baseline text-3xl text-blue-500 group-hover/box:text-blue-800">
      {text}
    </button>
    <svg
      className="ml-2 mt-2 w-8 h-8 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
  </div>
);

export default SearchButton;
