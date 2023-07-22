import { ReactElement } from "react";
import _map from "lodash/map";
import { EMPTY_RECORD } from "../../../constants";
import { Record } from "../../../types";

const COL1_CONFIG = [
  { label: "Board *", field: "Board", placeHolder: "CBSE" },
  {
    label: "Guardian Name *",
    field: "Guardian_Name",
    placeHolder: "Jessica Pearson",
  },
  { label: "Roll *", field: "Roll", placeHolder: "170106045" },
  {
    label: "Date of Birth *",
    field: "Date_of_Birth",
    placeHolder: "19/06/1999",
  },
  { label: "School *", field: "School", placeHolder: "PSBB" },
  { label: "Result *", field: "CGPA_Result", placeHolder: "PASS" },
];

const COL2_CONFIG = [
  { field: "Mathematics", placeHolder: "95" },
  { field: "Chemistry", placeHolder: "95" },
  { field: "Physics", placeHolder: "95" },
  { field: "Computer", placeHolder: "95" },
  { field: "Biology", placeHolder: "95" },
];

const COL3_CONFIG = [
  { label: "English Core", field: "English", placeHolder: "95" },
  { label: "Physical Education", field: "Physical", placeHolder: "95" },
  { field: "Economics", placeHolder: "95" },
  { label: "Business Studies", field: "Business", placeHolder: "95" },
  { field: "Accountancy", placeHolder: "95" },
];

type keyType = keyof typeof EMPTY_RECORD;

const Form = ({
  config,
  data,
  error,
  handleInputChange,
}: {
  config: any;
  data?: Record;
  error: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="mt-4 w-96">
    {_map(
      config,
      ({
        label,
        field,
        placeHolder,
      }: {
        label: string;
        field: string;
        placeHolder: string;
      }) => (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">
            {label ?? field}
          </label>
          <input
            className={`shadow appearance-none w-full placeholder:text-slate-400 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
              error && !data?.[field as keyType]
                ? "border-2 border-red-500"
                : ""
            }`}
            id={field}
            type="text"
            required
            placeholder={placeHolder}
            value={data?.[field as keyType]}
            onChange={handleInputChange}
          />
        </div>
      )
    )}
    {error ? (
      <label
        className="block text-sm text-blue-500 font-semibold"
        htmlFor="name">
        * Fields are necessary
      </label>
    ) : null}
  </div>
);

export const ExtendedForm = ({
  data,
  error,
  handleInputChange,
}: {
  data: any;
  error: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): ReactElement => {
  console.log(data);
  return (
    <form className="flex justify-evenly w-full">
      <Form
        error={error}
        config={COL1_CONFIG}
        data={data}
        handleInputChange={handleInputChange}
      />
      <Form
        error={false}
        config={COL2_CONFIG}
        data={data}
        handleInputChange={handleInputChange}
      />
      <Form
        error={false}
        config={COL3_CONFIG}
        data={data}
        handleInputChange={handleInputChange}
      />
    </form>
  );
};
