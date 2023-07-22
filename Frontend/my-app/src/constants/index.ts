export const PAGES = {
  HOME: "HOME_PAGE",
  UPLOAD: "UPLOAD_PAGE",
  SEARCH: "SEARCH_PAGE",
};

export const SEARCH_STATES = {
  DEFAULT: "default",
  SEARCHING: "searching",
  OVER: "over",
  DISABLED: "disabled",
};

export const PROCESS_STATES = {
  DEFAULT: "default",
  PROCESSING: "processing",
  OVER: "over",
};

export const ICONS = {
  UPLOAD: "upload",
  PROCESS: "process",
  SAVE: "save",
  SEARCH: "search",
};

export const DETAIL_FIELDS = {
  ID: "id",
  FIRSTNAME: "First_Name",
  LASTNAME: "Last_Name",
  IMAGE: "Marksheet_Image",
  BOARD: "Board",
  DOB: "Date_of_Birth",
  GUARDIANNAME: "Guardian_Name",
  ROLL: "Roll",
  SCHOOL: "School",
  RESULT: "CGPA_Result",
};

export const SUBJECT_FIELDS = {
  ACCOUNTANCY: "Accountancy",
  BIOLOGY: "Biology",
  BUSINESS: "Business",
  CHEMISTRY: "Chemistry",
  COMPUTER: "Computer",
  ECONOMICS: "Economics",
  ENGLISH: "English",
  MATHEMATICS: "Mathematics",
  PHYSICAL: "Physical",
  PHYSICS: "Physics",
};

type formValue = {
  [key: string]: string;
};

export const FIELDS: formValue = {
  ...DETAIL_FIELDS,
  ...SUBJECT_FIELDS,
};

export const OVERLAY_TYPES = {
  TABLE_VIEW: "table",
  SCORESHEET_VIEW: "score",
};

export const EMPTY_RECORD = {
  id: "",
  First_Name: "",
  Last_Name: "",
  Marksheet_Image: "",
  Board: "",
  Date_of_Birth: "",
  Guardian_Name: "",
  Roll: "",
  School: "",
  CGPA_Result: "",
  Accountancy: "",
  Biology: "",
  Business: "",
  Chemistry: "",
  Computer: "",
  Economics: "",
  English: "",
  Mathematics: "",
  Physical: "",
  Physics: "",
};
