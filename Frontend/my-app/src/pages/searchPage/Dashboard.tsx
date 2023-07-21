import { ReactElement, useMemo, useCallback, useState } from "react";
import _map from "lodash/map";
import { Text, Row } from "./components/Row";
import { OVERLAY_TYPES, SEARCH_STATES } from "../../constants";
import { ScoreSheet } from "./components/ScoreSheet";
import { Record } from "../../types";

export const Dashboard = ({
  records,
  searchState,
  handleSearchState,
}: {
  records: any;
  searchState: string;
  handleSearchState: (searchKey: string) => void;
}): ReactElement => {
  const headers = useMemo(
    () => [
      { headerText: "ID", headerClassName: "w-10 font-semibold" },
      { headerText: "First Name", headerClassName: "w-32 font-semibold" },
      { headerText: "Last Name", headerClassName: "w-32 font-semibold" },
      { headerText: "Marksheet Image", headerClassName: "w-40 font-semibold" },
      { headerText: "Board", headerClassName: "w-96 font-semibold" },
      { headerText: "DoB", headerClassName: "w-48 font-semibold" },
      { headerText: "Guardian Name", headerClassName: "w-40 font-semibold " },
      { headerText: "Roll", headerClassName: "w-24 font-semibold" },
      { headerText: "School", headerClassName: "w-96 font-semibold" },
      { headerText: "CGPA / Result", headerClassName: "w-32 font-semibold" },
      {
        headerText: "Subject Wise Marks",
        headerClassName: "w-48 font-semibold border-r-0",
      },
    ],
    []
  );

  const [overlay, setOverlay] = useState(OVERLAY_TYPES.TABLE_VIEW);
  const [scoreSheetRecord, setScoreSheetRecord] = useState(records?.[0]);

  const openScoresheet = useCallback(
    (record?: Record) => {
      setOverlay(OVERLAY_TYPES.SCORESHEET_VIEW);
      handleSearchState(SEARCH_STATES.DISABLED);
      setScoreSheetRecord(record);
    },
    [handleSearchState]
  );

  const closeScoresheet = useCallback(() => {
    setOverlay(OVERLAY_TYPES.TABLE_VIEW);
    handleSearchState(SEARCH_STATES.OVER);
  }, [handleSearchState]);

  return (
    <>
      {overlay === OVERLAY_TYPES.SCORESHEET_VIEW && (
        <ScoreSheet
          record={scoreSheetRecord}
          closeScoresheet={closeScoresheet}
        />
      )}
      <div className="flex items-center justify-center mt-4">
        {searchState === SEARCH_STATES.DEFAULT && (
          <p className="text-gray-400">Click the arrow to search</p>
        )}
        {searchState === SEARCH_STATES.OVER && (
          <div className="container w-full border-solid border-gray-400 border-4 rounded-md">
            <div className="item flex h-10 items-center">
              {_map(headers, ({ headerText, headerClassName }) => (
                <Text className={headerClassName}>{headerText}</Text>
              ))}
            </div>
            {_map(records, (record) => (
              <Row openScoresheet={openScoresheet} record={record} />
            ))}
            <div className="item"></div>
          </div>
        )}
      </div>
    </>
  );
};
