import { useCallback, useState } from "react";
import HomePage from "./pages/homePage";
import UploadPage from "./pages/uploadPage";
import SearchPage from "./pages/searchPage";

import { PAGES } from "./constants";
import Footer from "./components/Footer";

const ComponentVsPageMap = {
  [PAGES.HOME]: HomePage,
  [PAGES.UPLOAD]: UploadPage,
  [PAGES.SEARCH]: SearchPage,
};

const footerColorVsPageMap = {
  [PAGES.HOME]: "white",
  [PAGES.UPLOAD]: "black",
  [PAGES.SEARCH]: "black",
};

const App = () => {
  const [page, setPage] = useState(PAGES.HOME);
  const PageComponent = ComponentVsPageMap[page];

  const handleAction = useCallback(
    (pageToRedirect: string) => setPage(pageToRedirect),
    [setPage]
  );

  return (
    <div className="h-screen w-screen">
      <PageComponent handleAction={handleAction} />
      <Footer color={footerColorVsPageMap[page]} />
    </div>
  );
};

export default App;
