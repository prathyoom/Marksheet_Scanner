import { ReactElement, useMemo } from "react";
import { Record } from "../../../types";
import _map from "lodash/map";
import { BUTTON_ICONS, Button } from "./Button";
import { getConfig } from "../../../utils/helper";
import { SUBJECT_FIELDS } from "../../../constants";

const getLabel = (subject: string) => {
  if (subject === SUBJECT_FIELDS.ENGLISH) return "English Core";
  else if (subject === SUBJECT_FIELDS.PHYSICAL) return "physical Education";
  else if (subject === SUBJECT_FIELDS.BUSINESS) return "Business Studies";
  return subject;
};

export const ScoreSheet = ({
  record,
  closeScoresheet,
}: {
  record?: Record;
  closeScoresheet: () => void;
}): ReactElement => {
  const config = useMemo(() => getConfig({ record }), [record]);

  return (
    <div className="flex justify-center">
      <div className="w-2/5 max-h-full z-20 mt-12 absolute border-2 shadow-md flex-col flex justify-center items-center">
        <h1 className="mt-4 text-2xl font-semibold">Score Sheet</h1>
        <div className="m-auto mt-12">
          {_map(
            config,
            ({ subject, value }: { subject: string; value: string }) =>
              value !== "" ? (
                <div className="mb-4 flex justify-between items-center flex w-84">
                  <label
                    className="block text-gray-700 text-sm mr-4 font-bold"
                    htmlFor="name">
                    {getLabel(subject)}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-48 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    disabled={true}
                    value={value}
                  />
                </div>
              ) : null
          )}
        </div>
        <Button
          handleClick={closeScoresheet}
          className="w-24 h-10 mt-12 mb-4"
          textClassName="ml-2"
          icon={BUTTON_ICONS.CLOSE}
          text="Close"
        />
      </div>
    </div>
  );
};
