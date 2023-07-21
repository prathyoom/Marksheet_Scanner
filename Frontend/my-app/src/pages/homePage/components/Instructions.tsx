import { ReactElement } from "react";
import _map from "lodash/map";
import FileUploadIcon from "@rsuite/icons/FileUpload";
import CodeIcon from "@rsuite/icons/Code";
import DocPassIcon from "@rsuite/icons/DocPass";
import SearchPeopleIcon from "@rsuite/icons/SearchPeople";
import { ICONS } from "../../../constants";

const info = [
  {
    icon: ICONS.UPLOAD,
    text: "Enter your name and upload your Marksheet",
  },
  {
    icon: ICONS.PROCESS,
    text: "Marksheet gets processed by a Tesseract based ML model",
  },
  {
    icon: ICONS.SAVE,
    text: "Details are filled automatically from the processing, Fill out the remaining details. Submit to store it in the database",
  },
  {
    icon: ICONS.SEARCH,
    text: "Search for your details by typing in your name",
  },
];

const IconVsComponentMap = {
  [ICONS.UPLOAD]: FileUploadIcon,
  [ICONS.PROCESS]: CodeIcon,
  [ICONS.SAVE]: DocPassIcon,
  [ICONS.SEARCH]: SearchPeopleIcon,
};

const Block = ({
  icon,
  text,
}: {
  icon: string;
  text: string;
}): ReactElement => {
  const IconComponent = IconVsComponentMap[icon];

  return (
    <div className="flex flex-col h-full justify-center items-center w-1/4 mx-12">
      <IconComponent className="w-20 h-20 text-white" />
      <p className="mt-4 h-20 text-center text-white">{text}</p>
    </div>
  );
};

export const Instructions = (): ReactElement => {
  return (
    <div className="w-full h-full flex-col flex items-center">
      <p className="text-white mt-10 text-4xl font-semibold">How it works</p>
      <div className="w-full h-full flex items-center justify-evenly -mt-5">
        {_map(info, ({ icon, text }: { icon: string; text: string }) => (
          <>
            <Block icon={icon} text={text} />
            {icon !== ICONS.SEARCH ? (
              <svg
                className="w-30 h-20 text-white font-thin"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10">
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            ) : null}
          </>
        ))}
      </div>
    </div>
  );
};
