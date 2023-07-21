import { ReactElement } from "react";

const UploadButton = ({
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
      className="ml-3 mt-2 w-8 h-8 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 19">
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 15h.01M4 12H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-3m-5.5 0V1.07M5.5 5l4-4 4 4"
      />
    </svg>
  </div>
);

export default UploadButton;
