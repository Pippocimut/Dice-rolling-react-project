import {createSlice} from "@reduxjs/toolkit";

export type exportMenuState = {
    selectedSetId : number,
    selectedButtonId?: number,
    selectedTagId?: number,
    editMode: boolean,
}

const initialState: exportMenuState = {
    selectedSetId: 1,
    editMode: false,
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
        },
        toggleEditMode: (state) => {
            state.editMode = !state.editMode;
        }
    }
})

export const {
    setSelectedTag,
    setSelectedButton,
    setSelectedSet,
    toggleEditMode,
} = selectedSlice.actions

export default selectedSlice.reducer