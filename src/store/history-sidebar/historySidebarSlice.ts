import {createSlice} from "@reduxjs/toolkit";
import type {ButtonData} from "../button-sets/buttonSetSlice.ts";

export type RollResult = {
    name: string;
    result: string;
    total: number;
};

export type ButtonPressRecord = Omit<ButtonData, "rolls" | "position"> & {
    username: string;
    date: string;
    rollResult: RollResult[];
};

export type exportMenuState = {
    extended: boolean,
    scrollDown: boolean,
    selectedResult: number | null,
    rollHistory: ButtonPressRecord[]
}

const initialState: exportMenuState = {
    extended: true,
    selectedResult: null,
    scrollDown: true,
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
            const newId = state.rollHistory.length + 1
            state.rollHistory.push({
                ...action.payload,
                id: newId,
            });
            state.extended = true;
            state.scrollDown = true;
            state.selectedResult = null;
            document.cookie = "buttonPressHistory=" + JSON.stringify(state.rollHistory);
        },
        addRollFromSocket: (state, action: { payload: ButtonPressRecord }) => {
            const newId = state.rollHistory.length + 1
            state.rollHistory.push({
                ...action.payload,
                id: newId,
            });
            state.extended = true;
            document.cookie = "buttonPressHistory=" + JSON.stringify(state.rollHistory);
        },
        setSelectedResult: (state, action: { payload: number | null }) => {
            state.scrollDown = false;
            state.selectedResult = action.payload;
        }
    }
})

export const {
    toggleExtended,
    clearHistory,
    addRoll,
    addRollFromSocket,
    setSelectedResult
} = historySidebarSlice.actions

export default historySidebarSlice.reducer