import { ReactElement, useCallback, useState } from "react";
import BackButton from "../../components/BackButton";
import { PAGES, SEARCH_STATES } from "../../constants";
import { Dashboard } from "./Dashboard";
import { SearchBar } from "./components/SearchBar";

export const SearchPage = ({
  handleAction,
}: {
  handleAction: (pageToRedirect: string) => void;
}): ReactElement => {
  const handleBackAction = useCallback(
    () => handleAction(PAGES.HOME),
    [handleAction]
  );

  const [searchState, setSearchState] = useState(SEARCH_STATES.DEFAULT);

  const handleSearchState = useCallback(
    (searchKey: string) => setSearchState(searchKey),
    [setSearchState]
  );

  const [records, setRecords] = useState([]);

  const handleSearch = useCallback(
    async (searchInput: string) => {
      handleSearchState(SEARCH_STATES.SEARCHING);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      fetch(`http://localhost/php-api/marksheet/read.php?name=${searchInput}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((res) => setRecords(res.data));
      handleSearchState(SEARCH_STATES.OVER);
    },
    [handleSearchState]
  );

  return (
    <div className="h-screen w-screen">
      <BackButton
        text="Back"
        onButtonClick={handleBackAction}
        className="w-32"
      />
      <SearchBar
        searchState={searchState}
        handleSearchState={handleSearchState}
        handleSearch={handleSearch}
      />
      <Dashboard
        records={records}
        handleSearchState={handleSearchState}
        searchState={searchState}
      />
    </div>
  );
};
