import {createSlice} from "@reduxjs/toolkit";

export type exportMenuState = {
    editMode: boolean,
}

const initialState: exportMenuState = {
    editMode: false,
}

const selectedSlice = createSlice({
    name: "selected",
    initialState,
    reducers: {
        toggleEditMode: (state) => {
            state.editMode = !state.editMode;
        }
    }
})

export const {
    toggleEditMode,
} = selectedSlice.actions

export default selectedSlice.reducer