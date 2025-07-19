import {createSlice} from "@reduxjs/toolkit";

export type exportMenuState = {
    selectedSetId : number,
    selectedButtonId?: number,
    selectedTagId?: number,
}

const initialState: exportMenuState = {
    selectedSetId: 1
}

const selectedSlice = createSlice({
    name: "selected",
    initialState,
    reducers: {
        setSelectedTag: (state, action) => {
            state.selectedTagId = action.payload;
        },
        setSelectedButton: (state, action) => {
            state.selectedButtonId = action.payload;
        },
        setSelectedSet: (state, action) => {
            state.selectedSetId = action.payload;
        }
    }
})

export const {
    setSelectedTag,
    setSelectedButton,
    setSelectedSet,
} = selectedSlice.actions

export default selectedSlice.reducer