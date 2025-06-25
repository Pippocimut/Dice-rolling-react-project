import { useCookies } from "react-cookie";
import type { Roll } from "../pages/main/types.ts";

export type ButtonData = {
  name: string;
  rolls: Roll[];
  color: string;
  tag?: string;
};

export const useButtonList = () => {
  const { 0: cookies, 1: setCookie } = useCookies(["buttonList"]);

  if (!cookies.buttonList) {
    setCookie("buttonList", []);
  }

  const updateButtonList = (buttonList: ButtonData[]) => {
    setCookie("buttonList", buttonList);
  };

  return [cookies.buttonList, updateButtonList];
};
