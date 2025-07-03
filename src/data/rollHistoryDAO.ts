import { useCookies } from "react-cookie";
import type {ButtonData} from "../store/buttonSets/buttonSetSlice.ts";

export type RollResult = {
  name: string;
  total: number;
  totalAdv: number;
  totalDis: number;
};

export type ButtonPressRecord = Omit<ButtonData, "rolls"> & {
  rollResult: RollResult[];
};

export const useButtonPressedHistory = () => {
  const { 0: cookies, 1: setCookie } = useCookies(["buttonPressHistory"]);

  if (!cookies.buttonPressHistory) {
    setCookie("buttonPressHistory", []);
  }

  const updateButtonPressedHistory = (
    buttonPressHistory: ButtonPressRecord[]
  ) => {
    setCookie("buttonPressHistory", buttonPressHistory);
  };

  return [cookies.buttonPressHistory, updateButtonPressedHistory];
};
