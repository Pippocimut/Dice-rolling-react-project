import {createSlice} from "@reduxjs/toolkit";

export type settingsState = {
    audioOn: boolean;
}

const initialState: settingsState = {
    audioOn: false,
}

const buttonSetSlice = createSlice({
    name: "exportMenu",
    initialState,
    reducers: {
        toggleAudio: (state) => {
            state.audioOn = !state.audioOn;
        }
    }
})

export const {toggleAudio} = buttonSetSlice.actions

export default buttonSetSlice.reducer