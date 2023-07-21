import { ReactElement, useCallback } from "react";
import { PAGES } from "../../constants";
import BackButton from "../../components/BackButton";
import UploadForm from "./components/UploadForm";

export const UploadPage = ({
  handleAction,
}: {
  handleAction: (pageToRedirect: string) => void;
}): ReactElement => {
  const handleBackAction = useCallback(
    () => handleAction(PAGES.HOME),
    [handleAction]
  );

  return (
    <div className="h-screen w-screen">
      <BackButton
        text="Back"
        onButtonClick={handleBackAction}
        className="w-32"
      />
      <UploadForm />
    </div>
  );
};
