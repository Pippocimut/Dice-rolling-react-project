import type {Roll} from "../../pages/main/types.ts";
import {createSlice} from "@reduxjs/toolkit";

export type Tag = {
    color: string;
    name: string;
}

export type ButtonData = {
    name: string;
    rolls: Roll[];
    color: string;
    tag?: string;
};

export type ButtonSet = {
    name: string;
    tags: Tag[];
    buttonList: ButtonData[];
}

interface buttonSetState {
    sets: ButtonSet[]
}

const initialState: buttonSetState =
    document.cookie.includes("buttonSetsList") ? {
        sets: JSON.parse(decodeURIComponent(document.cookie.split("buttonSetsList=")[1].split(';')[0])) as ButtonSet[]
    } : {
        sets:
            [{
                name: "Default",
                tags: [
                    {
                        name: "attack",
                        color: "bg-red-500",
                    },
                    {
                        name: "saving throw",
                        color: "bg-blue-500",
                    },
                    {
                        name: "check",
                        color: "bg-green-500",
                    }
                ],
                buttonList: []
            }]
    }

const buttonSetSlice = createSlice({
    name: "buttonSet",
    initialState,
    reducers: {
        updateButtonSets: (state, action) => {
            state.sets = action.payload;
            document.cookie = "buttonSetsList=" + JSON.stringify(action.payload);
        }
    }
})

export const {updateButtonSets} = buttonSetSlice.actions

export default buttonSetSlice.reducer