import { useCallback, useState } from "react";
import UploadWindow from "./UploadWindow";
import { ExtendedForm } from "./ExtendedForm";
import { EMPTY_RECORD, PROCESS_STATES } from "../../../constants";
import { adaptFormValues, adaptOutputFields } from "../../../utils/helper";
import { Record } from "../../../types";
import CharacterAuthorizeIcon from "@rsuite/icons/CharacterAuthorize";

type keyType = keyof typeof EMPTY_RECORD;

const Form = () => {
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState(false);
  const [process, setProcess] = useState(PROCESS_STATES.DEFAULT);
  const [data, setData] = useState<Record>(EMPTY_RECORD);
  const [error, setError] = useState<boolean>(false);

  const processValidationCheck = () => {
    return data.First_Name === "" || data.Last_Name === "" || file === null;
  };

  const formValidationCheck = () => {
    const fields = [
      "Board",
      "Guardian_Name",
      "Roll",
      "Date_of_Birth",
      "School",
      "CGPA_Result",
    ];
    let check = 0;
    fields.forEach((field) => {
      if (!data[field as keyType]) check += 1;
    });
    if (check) return true;
    return false;
  };

  const handleFileChange = useCallback(
    (event: any) => {
      setFile(event.target.files[0]);
    },
    [setFile]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const onFormSubmit = async (event: any) => {
    event.preventDefault();

    if (formValidationCheck()) {
      setError(true);
      return;
    }
    setError(false);

    const formData = new FormData();
    const { columns, values } = adaptOutputFields({ data });
    formData.append("columns", columns as string);
    formData.append("values", values as string);

    await fetch("http://localhost/php-api/marksheet/create.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        setData(EMPTY_RECORD);
        setProcess(PROCESS_STATES.DEFAULT);
        setFile(null);
        setLabel(true);
      });
  };

  const onProcessSubmit = async (event: any) => {
    event.preventDefault();
    if (processValidationCheck()) {
      setError(true);
      return;
    }
    setError(false);

    setProcess(PROCESS_STATES.PROCESSING);

    const formData = new FormData();
    formData.append("first_name", data.First_Name);
    formData.append("last_name", data.Last_Name);
    formData.append("image", file!);

    await fetch("http://localhost/php-api/marksheet/process.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        const { columns, values } = res;
        setData(
          adaptFormValues({
            columns,
            values,
          }) as Record
        );
      });

    setProcess(PROCESS_STATES.OVER);
  };

  return (
    <form
      className="bg-white flex justify-center items-center rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={onFormSubmit}>
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="flex w-96">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                First Name *
              </label>
              <input
                className={`shadow appearance-none placeholder:text-slate-400 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${
                  error && !data.First_Name ? "border-2 border-red-500" : ""
                }`}
                id="First_Name"
                type="text"
                placeholder="Harvey"
                value={data.First_Name}
                onChange={handleInputChange}
              />
            </div>
            <div className="ml-4 mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Last Name *
              </label>
              <input
                className={`shadow appearance-none placeholder:text-slate-400 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline  ${
                  error && !data.Last_Name ? "border-2 border-red-500" : ""
                }`}
                id="Last_Name"
                type="text"
                placeholder="Specter"
                value={data.Last_Name}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="w-96">
            <UploadWindow
              error={error}
              file={file}
              process={process}
              handleFileChange={handleFileChange}
            />
          </div>
          {process === PROCESS_STATES.DEFAULT && (
            <>
              {label && (
                <div className="flex justify-center">
                  <CharacterAuthorizeIcon className="h-8 w-8 text-blue-500" />
                  <p className="ml-2 font-semibold">Form has been submitted</p>
                </div>
              )}
              <div className="flex items-center mt-6 justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={onProcessSubmit}>
                  Process
                </button>
              </div>
            </>
          )}
        </div>
        {process === PROCESS_STATES.OVER && (
          <>
            <ExtendedForm
              error={error}
              data={data}
              handleInputChange={handleInputChange}
            />
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 mt-auto absolute mb-4 text-2xl hover:bg-blue-700 text-white font-semibold w-32 h-12 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default Form;
