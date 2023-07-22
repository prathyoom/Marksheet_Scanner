import { ReactElement } from "react";
import { PROCESS_STATES } from "../../../constants";
import DetailIcon from "@rsuite/icons/Detail";
import GearIcon from "@rsuite/icons/Gear";

const Block = ({ text, subText }: { text: string; subText: string }) => (
  <div className="bg-grey border justify-center items-center h-32 flex shadow-sm">
    {text === "Processed" && <DetailIcon className="h-12 w-12 text-blue-500" />}
    {text === "Processing..." && (
      <GearIcon pulse className="h-12 w-12 text-blue-500" />
    )}
    <div className="text-center">
      <p className="text-3xl ml-4">{text}</p>
      <p className="text-sm ml-4 text-slate-500">{subText}</p>
    </div>
  </div>
);

const UploadWindow = ({
  file,
  error,
  process,
  handleFileChange,
  className,
}: {
  file: any;
  error: boolean;
  process: string;
  handleFileChange: (event: any) => void;
  className?: string;
}): ReactElement => (
  <>
    {process === PROCESS_STATES.DEFAULT && (
      <label
        htmlFor="file-upload"
        className={`bg-grey border justify-center rounded px-8 pt-6 pb-8 mb-4 flex group/box shadow-sm hover:shadow-lg ${className}  ${
          error && file === null ? "border-2 border-red-500" : ""
        }`}
        onChange={(somethng) => handleFileChange(somethng)}>
        <svg
          className="ml-4 mt-2 w-8 h-8 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path d="m14.707 4.793-4-4a1 1 0 0 0-1.416 0l-4 4a1 1 0 1 0 1.416 1.414L9 3.914V12.5a1 1 0 0 0 2 0V3.914l2.293 2.293a1 1 0 0 0 1.414-1.414Z" />
          <path d="M18 12h-5v.5a3 3 0 0 1-6 0V12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
        </svg>
        <input className="ml-6 font-semibold" id="file-upload" type="file" />
      </label>
    )}
    {process === PROCESS_STATES.PROCESSING && (
      <Block text="Processing..." subText="Estimated Time ~ 10 secs" />
    )}
    {process === PROCESS_STATES.OVER && (
      <>
        <Block text="Processed" subText="Autofilled Details" />
        <p></p>
      </>
    )}
  </>
);

export default UploadWindow;
