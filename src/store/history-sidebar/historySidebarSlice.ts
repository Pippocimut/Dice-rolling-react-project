import {createSlice} from "@reduxjs/toolkit";
import type {ButtonData} from "../button-sets/buttonSetSlice.ts";

export type RollResult = {
    name: string;
    total: number;
    totalAdv: number;
    totalDis: number;
};

export type ButtonPressRecord = Omit<ButtonData, "rolls" | "id"> & {
    username: string;
    date: string;
    rollResult: RollResult[];
};

export type exportMenuState = {
    extended: boolean,
    rollHistory: ButtonPressRecord[]
}

const initialState: exportMenuState = {
    extended: true,
    rollHistory: document.cookie.includes("buttonPressHistory") ? JSON.parse(decodeURIComponent(document.cookie.split("buttonPressHistory=")[1].split(';')[0])) : []
}

const historySidebarSlice = createSlice({
    name: "historySidebar",
    initialState,
    reducers: {
        toggleExtended: (state) => {
            state.extended = !state.extended;
        },
        extend: (state) => {
            state.extended = true;
        },
        clearHistory: (state) => {
            state.rollHistory = [];
            state.extended = false;
            document.cookie = "buttonPressHistory=" + JSON.stringify(state.rollHistory);
        },
        addRoll: (state, action: { payload: ButtonPressRecord }) => {
            state.rollHistory.push(action.payload);
            state.extended = true;
            document.cookie = "buttonPressHistory=" + JSON.stringify(state.rollHistory);
        }
    }
})

export const {
    toggleExtended,
    clearHistory,
    addRoll,
} = historySidebarSlice.actions

export default historySidebarSlice.reducer