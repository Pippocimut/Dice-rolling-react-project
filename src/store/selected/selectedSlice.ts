import {createSlice} from "@reduxjs/toolkit";

export type exportMenuState = {
    selectedSetId : number,
    selectedButtonId?: number,
    selectedTagId?: number,
    editMode: boolean,
}

const initialState: exportMenuState = {
    selectedSetId: document.cookie.includes("selectedSetId") ? JSON.parse(decodeURIComponent(document.cookie.split("selectedSetId=")[1].split(';')[0])).selectedSetId as number : 1,
    editMode: false,
}

const selectedSlice = createSlice({
    name: "selected",
    initialState,
    reducers: {
        setSelectedSet: (state, action) => {
            state.selectedSetId = action.payload;
            document.cookie = "selectedSetId=" + JSON.stringify({selectedSetId: action.payload});
        },
        toggleEditMode: (state) => {
            state.editMode = !state.editMode;
        }
    }
})

export const {
    setSelectedSet,
    toggleEditMode,
} = selectedSlice.actions

export default selectedSlice.reducer