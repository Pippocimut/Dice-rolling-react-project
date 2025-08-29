import type {Roll} from "../../pages/main/types.ts";
import {createSlice} from "@reduxjs/toolkit";

export type Tag = {
    id: number;
    color: string;
    name: string;
    rollsConfig?: Roll[]
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
    tags: Tag[];
    buttonList: ButtonData[];
}

interface buttonSetState {
    nextSetId: number;
    nextButtonId: number;
    nextTagId: number;
    sets: ButtonSet[]
}


export const colors = [
    "red-roll-button",
    "orange-roll-button",
    "yellow-roll-button",
    "green-roll-button",
    "blue-roll-button",
    "purple-roll-button",
    "pink-roll-button",
    "gray-roll-button"
];

const initialState: buttonSetState =
    document.cookie.includes("buttonSetsList") ? JSON.parse(decodeURIComponent(document.cookie.split("buttonSetsList=")[1].split(';')[0])) as buttonSetState
        : {
            nextSetId: 2,
            nextTagId: 4,
            nextButtonId: 1,
            sets:
                [{
                    id: 1,
                    name: "Default",
                    tags: [
                        {
                            id: 1,
                            name: "attack",
                            color: "red-roll-button",
                        },
                        {
                            id: 2,
                            name: "saving throw",
                            color: "blue-roll-button",
                        },
                        {
                            id: 3,
                            name: "check",
                            color: "green-roll-button",
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
        updateButtonOfSet: (state, action: {
            payload: {
                setId: number,
                button: ButtonData,
            }
        }) => {
            const setId = action.payload.setId;
            const button = action.payload.button;

            const set = state.sets.find(set => set.id === setId);
            if (!set) return;

            const index = set.buttonList.findIndex(Ibutton => Ibutton.id === button.id)
            if (index === -1) return;

            set.buttonList[index] = button;

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addTagToSet: (state, action) => {
            const setId = action.payload.setId;
            const tag: Tag = action.payload.tag;

            const set = state.sets.find(set => set.id === setId);

            if (!set) return;
            if (set.tags.find(t => t.name === tag.name)) return;
            tag.id = state.nextTagId++;
            set.tags.push(tag);

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        deleteTagFromSet: (state, action: {
            payload: {
                setId: number,
                tagId: number
            }
        }) => {
            const setId = action.payload.setId;
            const tagId = action.payload.tagId;

            const set = state.sets.find(set => set.id === setId);

            if (!set) return;

            const index = set.tags.findIndex(tag => tag.id === tagId);

            if (index === -1) return;

            set.tags.splice(index, 1);
            set.buttonList = set.buttonList.map((item: ButtonData) => {
                if (item.tag === tagId) {
                    item.tag = -1
                }
                return item;
            })

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        editTagOfSet: (state, action: {
            payload: {
                setId: number,
                tagId: number
                newTag: Tag
            }
        }) => {

            const setId = action.payload.setId;
            const tagId = action.payload.tagId;
            const newTag = action.payload.newTag;
            const set = state.sets.find(set => set.id === setId);
            if (!set) return;

            const index = set.tags.findIndex(tag => tag.id === tagId);
            if (index === -1) return;

            set.tags = set.tags.map((item: Tag) => {
                if (item.id === tagId) {
                    return newTag
                }
                return item;
            })

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addButtonToSet: (state, action: {
            payload: {
                setId: number,
                button: Omit<ButtonData, "id">
            }
        }) => {
            const setId = action.payload.setId;
            const button: Omit<ButtonData, "id"> = action.payload.button;

            const set = state.sets.find(set => set.id === setId) ?? state.sets.find(set => set.id === 1);
            if (!set) return;

            set.buttonList.push({
                ...button,
                id: state.nextButtonId++,
            });

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        sendNewButtonList: (state, action: {
            payload: {
                setId: number,
                buttons: ButtonData[]
            }
        }) => {
            const {
                setId,
                buttons
            } = action.payload;

            const setIndex = state.sets.findIndex(set => set.id === setId);
            if (setIndex === -1) return;
            state.sets[setIndex].buttonList = buttons;

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addNewSet: (state, action: { payload: ButtonSet }) => {
            const set = action.payload;
            set.id = state.nextSetId;
            state.nextSetId++;
            state.nextButtonId = 0;
            state.nextTagId = 0;

            set.tags = set.tags.map((tag: Tag) => {
                state.nextTagId++;
                return {
                    ...tag,
                    id: state.nextTagId
                }
            })

            set.buttonList = set.buttonList.map((button: ButtonData) => {
                state.nextButtonId++;
                return {
                    ...button,
                    id: state.nextButtonId
                }
            })

            state.sets.push(set);
            console.log(set);
            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        deleteButtonOfSet: (state, action: {
            payload: {
                setId: number
                id: number
            }
        }) => {
            const setId = action.payload.setId;
            const id = action.payload.id;

            const findIndex = state.sets.findIndex(set => set.id === setId);
            if (findIndex === -1) return;

            state.sets[findIndex].buttonList = state.sets[findIndex].buttonList.filter(button => button.id !== id);

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        deleteTagOfSet: (state, action: {
            payload: {
                setId: number,
                tagId: number
            }
        }) => {
            const setId = action.payload.setId;
            const tagId = action.payload.tagId;

            const set = state.sets.find(set => set.id === setId);
            if (!set) return;

            set.tags = set.tags.filter(t => t.id !== tagId);
            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        }
    }
})

export const {
    updateButtonSets,
    addButtonToSet,
    updateButtonOfSet,
    deleteButtonOfSet,
    deleteTagFromSet,
    deleteTagOfSet,
    addTagToSet,
    editTagOfSet,
    addNewSet,
    sendNewButtonList
} = buttonSetSlice.actions

export default buttonSetSlice.reducer