import {createSlice} from "@reduxjs/toolkit";
import type {ButtonData} from "../button-sets/buttonSetSlice.ts";

export type RollResult = {
    name: string;
    result: string;
    total: number;
};

export type ButtonPressRecord = Omit<ButtonData, "rolls"| "nextRollId" | "position" | "nextTriggerId" | "triggers"> & {
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
    rollHistory: localStorage.getItem("buttonPressHistory") ? JSON.parse(localStorage.getItem("buttonPressHistory") ?? "") : []
}

const historySidebarSlice = createSlice({
    name: "historySidebar",
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.rollHistory = [];
            state.extended = false;
            const stringState = JSON.stringify(state.rollHistory)
            localStorage.setItem("buttonPressHistory", stringState);
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
            const stringState = JSON.stringify(state.rollHistory)
            localStorage.setItem("buttonPressHistory", stringState);
        },
        addRollFromSocket: (state, action: { payload: ButtonPressRecord }) => {
            const newId = state.rollHistory.length + 1
            state.rollHistory.push({
                ...action.payload,
                id: newId,
            });
            state.extended = true;
            const stringState = JSON.stringify(state.rollHistory)
            localStorage.setItem("buttonPressHistory", stringState);
        },
        setSelectedResult: (state, action: { payload: number | null }) => {
            state.scrollDown = false;
            state.selectedResult = action.payload;
            const stringState = JSON.stringify(state.rollHistory)
            localStorage.setItem("buttonPressHistory", stringState);
        }
    }
})

export const {
    clearHistory,
    addRoll,
    addRollFromSocket,
    setSelectedResult
} = historySidebarSlice.actions

export default historySidebarSlice.reducer