import { ReactElement, useCallback, useState } from "react";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import TextImageIcon from "@rsuite/icons/TextImage";
import { SEARCH_STATES } from "../../../constants";

const IconVsSearchState = {
  [SEARCH_STATES.DEFAULT]: (
    <ArrowRightLineIcon className="w-6 h-6 text-gray-400" />
  ),
  [SEARCH_STATES.SEARCHING]: (
    <SpinnerIcon pulse className="w-6 h-6 text-gray-400" />
  ),
  [SEARCH_STATES.OVER]: <TextImageIcon className="w-6 h-6 text-gray-400" />,
};

export const SearchBar = ({
  searchState,
  handleSearchState,
  handleSearch,
}: {
  searchState: string;
  handleSearchState: (searchKey: string) => void;
  handleSearch: (searchInput: string) => void;
}): ReactElement => {
  const [searchInput, setSearchInput] = useState<string>("");

  const onSubmit = useCallback(
    () => handleSearch(searchInput),
    [handleSearch, searchInput]
  );

  const handleInputChange = useCallback(
    (searchText: string) => {
      setSearchInput(searchText);
      handleSearchState(SEARCH_STATES.DEFAULT);
    },
    [handleSearchState]
  );

  return (
    <div className={`flex justify-center`}>
      <div className="flex bg-stone-200	w-1/2 m-4 h-12 items-center rounded-md">
        <svg
          className="w-6 h-6 text-gray-400 dark:text-white ml-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20">
          <path d="M8 15.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm11.707 2.793-4-4a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414-1.414Z" />
        </svg>
        <input
          className={`bg-stone-200 ml-4 caret-slate-400 text-gray-500 placeholder:text-gray-400 focus:outline-none w-full  ${
            searchState === SEARCH_STATES.DISABLED ? "pointer-events-none" : ""
          }`}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Name of the student"
        />
        <button
          className={`mr-4 ml-auto  ${
            searchState === SEARCH_STATES.DISABLED ? "pointer-events-none" : ""
          }`}
          onClick={onSubmit}>
          {IconVsSearchState[searchState]}
        </button>
      </div>
    </div>
  );
};
