import { ReactElement, useCallback } from "react";
import { PAGES } from "../../constants";
import UploadButton from "./components/UploadButton";
import SearchButton from "./components/SearchButton";
import { Instructions } from "./components/Instructions";

export const HomePage = ({
  handleAction,
}: {
  handleAction: (pageToRedirect: string) => void;
}): ReactElement => {
  const handleSeachButton = useCallback(
    () => handleAction(PAGES.SEARCH),
    [handleAction]
  );

  const handleUploadButton = useCallback(
    () => handleAction(PAGES.UPLOAD),
    [handleAction]
  );

  return (
    <div className="h-full relative">
      <div className="max-w-full flex items-center justify-center w-full h-1/2">
        <div className="w-200">
          <div>
            <h1 className="text-4 text-6xl font-semibold text-center">
              Marksheet Portal
            </h1>
            <h5 className="mt-2 text-center">
              You can upload and search through Marksheets here
            </h5>
          </div>

          <div className="flex mt-4 justify-center">
            <UploadButton
              text="Upload"
              onButtonClick={handleUploadButton}
              className="mt-2"
            />
            <SearchButton
              text="Search"
              onButtonClick={handleSeachButton}
              className="mt-2 ml-5"
            />
          </div>
        </div>
      </div>
      <div className="h-1/2 bg-blue-500">
        <Instructions />
      </div>
    </div>
  );
};
