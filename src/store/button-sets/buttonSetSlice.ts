import type {Roll} from "../../pages/main/types.ts";
import {createSlice} from "@reduxjs/toolkit";

export type Tag = {
    id: number;
    color: string;
    name: string;
}

export type ButtonData = {
    id: number;
    name: string;
    rolls: Roll[];
    color: string;
    tag?: number;
};

export type ButtonSet = {
    id: number;
    name: string;
    nextButtonId: number;
    nextTagId: number;
    tags: Tag[];
    buttonList: ButtonData[];
}

interface buttonSetState {
    nextSetId: number;
    sets: ButtonSet[]
}

const initialState: buttonSetState =
    document.cookie.includes("buttonSetsList") ? JSON.parse(decodeURIComponent(document.cookie.split("buttonSetsList=")[1].split(';')[0])) as buttonSetState
        : {
            nextSetId: 1,
            sets:
                [{
                    id: 1,
                    nextButtonId: 1,
                    nextTagId: 4,
                    name: "Default",
                    tags: [
                        {
                            id: 1,
                            name: "attack",
                            color: "bg-red-500",
                        },
                        {
                            id: 2,
                            name: "saving throw",
                            color: "bg-blue-500",
                        },
                        {
                            id: 3,
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
            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        updateButtonOfSet: (state, action) => {
            const setName = action.payload.setName;
            const button = action.payload.button;
            const tag = action.payload.tag;

            const set = state.sets.find(set => set.name === setName);
            if (!set) return;

            console.log("Updating this button now:", button)

            const index = set.buttonList.findIndex(Ibutton => Ibutton.id === button.id)

            console.log(button, "index:", index)
            console.log(set.buttonList)

            console.log("Index of this button:", index)
            if (index === -1) return;

            if (tag.id === -1) {
                tag.id = set.nextTagId++;
                set.tags.push(tag)
            }

            button.tag = tag.id;

            set.buttonList[index] = button;

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addTagToSet: (state, action) => {
            const setName = action.payload.setName;
            const tag: Tag = action.payload.tag;

            const set = state.sets.find(set => set.name === setName);
            if (!set) return;

            if (set.tags.find(t => t.name === tag.name)) return;

            tag.id = set.nextTagId++;
            set.tags.push(tag);

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addButtonToSet: (state, action) => {
            const setName = action.payload.setName;
            const button: ButtonData = action.payload.button;
            const tag: Tag = action.payload.tag;

            const set = state.sets.find(set => set.name === setName) ?? state.sets.find(set => set.id === 1);
            if (!set) return;

            if (tag.id === -1) {
                tag.id = set.nextTagId++;
                set.tags.push(tag);
            }

            button.id = set.nextButtonId++;
            button.tag = tag.id;

            set.buttonList.push(button);

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addNewSet: (state, action: { payload: ButtonSet }) => {
            const set = action.payload;
            set.id = state.nextSetId;
            state.nextSetId++;
            set.nextButtonId = 0;
            set.nextTagId = 0;

            set.tags = set.tags.map((tag: Tag) => {
                set.nextTagId++;
                return {
                    ...tag,
                    id: set.nextTagId
                }
            })

            set.buttonList = set.buttonList.map((button: ButtonData) => {
                set.nextButtonId++;
                return {
                    ...button,
                    id: set.nextButtonId
                }
            })

            state.sets.push(set);
        },
        deleteButtonOfSet: (state, action) => {
            const setName = action.payload.setName;
            const index = action.payload.index;

            const set = state.sets.find(set => set.name === setName);
            if (!set) return;

            set.buttonList.splice(index, 1);
            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        deleteTagOfSet: (state, action) => {
            const setName = action.payload.setName;
            const tagName = action.payload.tagName;

            const set = state.sets.find(set => set.name === setName);
            if (!set) return;

            set.tags = set.tags.filter(t => t.name !== tagName);
            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        }
    }
})

export const {
    updateButtonSets,
    addButtonToSet,
    addTagToSet,
    updateButtonOfSet,
    deleteButtonOfSet,
    deleteTagOfSet,
    addNewSet
} = buttonSetSlice.actions

export default buttonSetSlice.reducer