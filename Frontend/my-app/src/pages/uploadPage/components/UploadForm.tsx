import { useCallback, useState } from "react";
import UploadWindow from "./UploadWindow";
import { ExtendedForm } from "./ExtendedForm";
import { EMPTY_RECORD, PROCESS_STATES } from "../../../constants";
import { adaptFormValues } from "../../../utils/helper";
import { Record } from "../../../types";

const Form = () => {
  const [file, setFile] = useState(null);
  const [process, setProcess] = useState(PROCESS_STATES.DEFAULT);
  const [data, setData] = useState<Record>(EMPTY_RECORD);

  const handleChange = useCallback(
    (event: any) => {
      setFile(event.target.files[0]);
    },
    [setFile]
  );

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setProcess(PROCESS_STATES.PROCESSING);

    const formData = new FormData();
    formData.append("first_name", "hello");
    formData.append("last_name", "genius");
    formData.append("image", file!);

    await fetch("http://localhost/php-api/marksheet/process.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        setData(
          adaptFormValues({
            columns: res.columns,
            values: res.values,
          }) as Record
        );
      });

    setProcess(PROCESS_STATES.OVER);
  };

  return (
    <form
      className="bg-white flex justify-center items-center rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={onSubmit}>
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="flex w-96">
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                First Name
              </label>
              <input
                className="shadow appearance-none placeholder:text-slate-400 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Harvey"
              />
            </div>
            <div className="ml-4 mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Last Name
              </label>
              <input
                className="shadow appearance-none border placeholder:text-slate-400 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Specter"
              />
            </div>
          </div>
          <div className="mb-6 w-96">
            <UploadWindow process={process} handleChange={handleChange} />
          </div>
          {process === PROCESS_STATES.DEFAULT && (
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                Process
              </button>
            </div>
          )}
        </div>
        {process === PROCESS_STATES.OVER && (
          <>
            <ExtendedForm data={data} />
            <div className="flex justify-center">
              <button
                className="bg-blue-500 -mt-14 text-2xl hover:bg-blue-700 text-white font-semibold w-32 h-15 rounded focus:outline-none focus:shadow-outline"
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
