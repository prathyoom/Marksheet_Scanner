import { ReactElement, useState } from "react";
import _map from "lodash/map";
import _findIndex from "lodash/findIndex";
import { FIELDS } from "../../../constants";
import { initial } from "lodash";

const COL1_CONFIG = [
  { field: "Board", placeHolder: "CBSE" },
  { field: "Guardian_Name", placeHolder: "Jessica Pearson" },
  { field: "Roll", placeHolder: "170106045" },
  { field: "Date_of_Birth", placeHolder: "19/06/1999" },
  { field: "School", placeHolder: "PSBB" },
  { field: "Result", placeHolder: "PASS" },
];

const COL2_CONFIG = [
  { field: "Mathematics", placeHolder: "95" },
  { field: "Chemistry", placeHolder: "95" },
  { field: "Physics", placeHolder: "95" },
  { field: "Computer", placeHolder: "95" },
  { field: "Biology", placeHolder: "95" },
];

const COL3_CONFIG = [
  { field: "English", placeHolder: "95" },
  { field: "Physical", placeHolder: "95" },
  { field: "Economics", placeHolder: "95" },
  { field: "Business", placeHolder: "95" },
  { field: "Accountancy", placeHolder: "95" },
];

const Form = ({
  config,
  data,
}: {
  config: any;
  data?: { columns: string[]; values: string[] };
}) => (
  <div className="mt-4">
    {_map(
      config,
      ({ field, placeHolder }: { field: string; placeHolder: string }) => {
        console.log(field, _findIndex(data?.columns, field));
        return (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              {field}
            </label>
            <input
              className="shadow appearance-none w-96 placeholder:text-slate-400 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder={placeHolder}
            />
          </div>
        );
      }
    )}
  </div>
);

export const ExtendedForm = ({ data }: { data: any }): ReactElement => {
  // const [formData, setFormData] = useState(initialFormValue(data));

  return (
    <div className="flex justify-evenly w-full">
      <Form config={COL1_CONFIG} data={data} />
      <Form config={COL2_CONFIG} data={data} />
      <Form config={COL3_CONFIG} data={data} />
    </div>
  );
};
