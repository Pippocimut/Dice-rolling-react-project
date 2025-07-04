

import {createSlice} from "@reduxjs/toolkit";
import type {Tag} from "../button-sets/buttonSetSlice.ts";

export type exportMenuState = {
    selectedSet : string,
    selectedButton?: string,
    selectedTag?: Tag,
}

const initialState: exportMenuState = {
    selectedSet: "Default"
}

const selectedSlice = createSlice({
    name: "selected",
    initialState,
    reducers: {
        setSelectedTag: (state, action) => {
            state.selectedTag = action.payload;
        },
        setSelectedButton: (state, action) => {
            state.selectedButton = action.payload;
        },
        setSelectedSet: (state, action) => {
            state.selectedSet = action.payload;
        }
    }
})

export const {
    setSelectedTag,
    setSelectedButton,
    setSelectedSet,
} = selectedSlice.actions

export default selectedSlice.reducer