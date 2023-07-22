import { EMPTY_RECORD, FIELDS, SUBJECT_FIELDS } from "../constants";
import { Record } from "../types";
import wordsToNumbers from "words-to-numbers";

const getString = (word: string) => {
  if (word && /^[a-zA-Z0-9]/.test(word)) {
    return word;
  }
  return "";
};

const getValue = (word?: string) => {
  if (word) {
    return String(wordsToNumbers(getString(word)));
  }
  return "";
};

export const adaptRecordToTable = ({ record }: { record: Record }) => {
  const dateOfBirth = wordsToNumbers(record?.Date_of_Birth) ?? "";

  return [
    { value: getString(record.id), className: "w-10" },
    { value: getString(record.First_Name), className: "w-32" },
    { value: getString(record.Last_Name), className: "w-32" },
    { value: getString(record.Marksheet_Image), className: "w-40" },
    { value: getString(record.Board), className: "w-96" },
    { value: getString(String(dateOfBirth)), className: "w-48" },
    { value: getString(record.Guardian_Name), className: "w-40" },
    { value: getString(record.Roll), className: "w-24" },
    { value: getString(record.School), className: "w-96" },
    { value: getString(record.CGPA_Result), className: "w-32" },
  ];
};

export const getConfig = ({ record }: { record?: Record }) => {
  return [
    { subject: SUBJECT_FIELDS.ENGLISH, value: getValue(record?.English) },
    {
      subject: SUBJECT_FIELDS.MATHEMATICS,
      value: getValue(record?.Mathematics),
    },
    { subject: SUBJECT_FIELDS.PHYSICAL, value: getValue(record?.Physical) },
    { subject: SUBJECT_FIELDS.PHYSICS, value: getValue(record?.Physics) },
    { subject: SUBJECT_FIELDS.CHEMISTRY, value: getValue(record?.Chemistry) },
    { subject: SUBJECT_FIELDS.COMPUTER, value: getValue(record?.Computer) },
    {
      subject: SUBJECT_FIELDS.ACCOUNTANCY,
      value: getValue(record?.Accountancy),
    },
    { subject: SUBJECT_FIELDS.BUSINESS, value: getValue(record?.Business) },
    { subject: SUBJECT_FIELDS.ECONOMICS, value: getValue(record?.Economics) },
    { subject: SUBJECT_FIELDS.BIOLOGY, value: getValue(record?.Biology) },
  ];
};

type formValue = {
  [key: string]: string;
};

export const adaptFormValues = ({
  columns,
  values,
}: {
  columns?: string;
  values?: string;
}): Record => {
  if (columns === undefined || values === undefined) {
    return EMPTY_RECORD;
  }
  columns = columns.replace(/[^a-zA-Z_,]/g, "");
  values = values.replace(/[^a-zA-Z_\s,]/g, "");
  const colArray = columns.split(",");
  const valArray = values.split(",");
  const subjectArray = Object.values(SUBJECT_FIELDS);

  const formValue: formValue = colArray.reduce((acc, key, index) => {
    if (subjectArray.includes(key)) acc[key] = getValue(valArray[index]);
    else acc[key] = valArray[index];
    return acc;
  }, {} as formValue);

  return formValue as Record;
};

type keyType = keyof typeof EMPTY_RECORD;

export const adaptOutputFields = ({ data }: { data: Record }) => {
  const keys = Object.keys(FIELDS);

  const columns = keys.reduce((acc, key) => {
    acc.push((FIELDS[key] as string) ?? "");
    return acc;
  }, [] as String[]);

  const values = keys.reduce((acc, key) => {
    acc.push((data[FIELDS[key] as keyType] as string) ?? "");
    return acc;
  }, [] as String[]);

  let columns_string = columns.reduce((acc, key) => {
    return acc.concat(key.toString()) + "`,`";
  }, "" as string);

  let values_string = values.reduce((acc, key) => {
    return acc.concat(key.toString()) + "','";
  }, "" as string);

  columns_string = "`" + columns_string;
  columns_string = columns_string.substring(0, columns_string.length - 2);

  values_string = "'" + values_string;
  values_string = values_string.substring(0, values_string.length - 2);

  return { values: values_string, columns: columns_string };
};
