import { PAGES } from "../constants";

const footerColorVsPageMap = {
  [PAGES.HOME]: "white",
  [PAGES.UPLOAD]: "black",
  [PAGES.SEARCH]: "black",
};

const Footer = ({ color }: { color: string }) => (
  <p
    className={`text-center text-xs text-${footerColorVsPageMap[color]} absolute -mt-8 z-10 w-full`}>
    Prathyoom MS. All Rights Reserved.
  </p>
);

export default Footer;
