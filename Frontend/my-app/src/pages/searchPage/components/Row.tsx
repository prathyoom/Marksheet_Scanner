import { ReactElement, useMemo, useCallback } from "react";
import _map from "lodash/map";
import { Record } from "../../../types";
import { adaptRecordToTable } from "../../../utils/helper";
import { BUTTON_ICONS, Button } from "./Button";

const HorizonalLine = () => <div className="border-solid border-2 w-full" />;

export const Text = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <div
    className={`border-r-4 h-10 truncate text-sm text-center justify-center items-center flex ${className}`}>
    <p>{children}</p>
  </div>
);

export const Row = ({
  record,
  openScoresheet,
}: {
  record: Record;
  openScoresheet: (record?: Record) => void;
}): ReactElement => {
  const recordConfig = useMemo(() => adaptRecordToTable({ record }), [record]);
  const handleClick = useCallback(
    () => openScoresheet(record),
    [openScoresheet, record]
  );

  return (
    <>
      <HorizonalLine />
      <div className="item flex h-10 items-center">
        {_map(recordConfig, ({ value, className }) => (
          <Text className={className}>{value}</Text>
        ))}
        <div className="w-48">
          <Button
            handleClick={handleClick}
            className="w-32 h-7 ml-2"
            textClassName="mr-4"
            icon={BUTTON_ICONS.MEMBER}
            text="Details"
          />
        </div>
      </div>
    </>
  );
};
