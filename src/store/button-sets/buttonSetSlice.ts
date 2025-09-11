import type {Roll} from "@/pages/main/types.ts";
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
    position: number;
};

export type ButtonSet = {
    id: number;
    version: "1.0";
    name: string;
    tags: Tag[];
    buttonList: ButtonData[];
} | {
    id: number;
    version: "1.1";
    name: string;
    tags: Record<number, Tag>;
    buttonList: Record<number, ButtonData>;
}

interface buttonSetState {
    nextSetId: number;
    nextButtonId: number;
    nextTagId: number;
    currentVersion: string;
    selectedSetId: number;
    sets: Record<number, ButtonSet>;
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
            currentVersion: "1.1",
            selectedSetId: 1,
            sets: {
                1: {
                    id: 1,
                    version: "1.1",
                    name: "Default",
                    tags: {
                        1: {
                            id: 1,
                            name: "attack",
                            color: "red-roll-button",
                            rollsConfig: []
                        },
                        2: {
                            id: 2,
                            name: "saving throw",
                            color: "blue-roll-button",
                            rollsConfig: []
                        },
                        3: {
                            id: 3,
                            name: "check",
                            color: "green-roll-button",
                            rollsConfig: []
                        }
                    },
                    buttonList: {}
                }
            }
        }

const buttonSetSlice = createSlice({
    name: "buttonSet",
    initialState,
    reducers: {
        setSelectedSet: (state, action) => {
            state.selectedSetId = action.payload;
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

            const set = state.sets[setId];
            if (!set) return;

            set.buttonList[button.id] = button;

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addTagToSet: (state, action) => {
            const setId = action.payload.setId;
            const tag: Tag = action.payload.tag;

            const set = state.sets[setId];

            if (!set) return;
            if (Object.values(set.tags).find(t => t.name === tag.name)) return;


            set.tags[state.nextTagId] = {
                ...tag,
                id: state.nextTagId,
            };

            state.nextTagId++

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

            const set = state.sets[setId];

            if (!set) return;

            delete set.tags[tagId]

            const idToDelete = Object.values(set.buttonList).filter(button => button.tag === tagId).map(button => button.id);
            idToDelete.forEach(id => delete set.buttonList[id]);

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
            const set = state.sets[setId];
            if (!set) return;

            set.tags[tagId] = newTag

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

            const set = state.sets[setId] ?? state.sets[1];
            if (!set) return;

            set.buttonList[state.nextButtonId] = {
                ...button,
                id: state.nextButtonId,
                position: state.nextButtonId
            };

            state.nextButtonId++;

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
            state.sets[setId].buttonList = buttons.reduce((acc, button) => {
                acc[button.id] = button;
                return acc;
            }, {} as Record<number, ButtonData>)

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        },
        addNewSet: (state, action: { payload: ButtonSet }) => {
            const set = action.payload;

            if (state.currentVersion === "1.1") {
                const tempTags: Record<number, Tag> = {}
                const tempButtonList: Record<number, ButtonData> = {}

                if (set.version === "1.0") {
                    set.tags.forEach((value: Tag) => {
                        set.buttonList = Object.values(set.buttonList).map((value: ButtonData) => {
                            if (value.tag === value.id) {
                                value.tag = state.nextTagId;
                            }
                            return value;
                        })

                        tempTags[state.nextTagId] = {
                            ...value,
                            id: state.nextTagId++
                        }
                    })

                    set.buttonList.forEach((value: ButtonData) => {
                        tempButtonList[state.nextButtonId] = {
                            ...value,
                            id: state.nextButtonId++
                        }
                    })

                } else if (set.version === "1.1") {
                    Object.entries(set.tags).forEach(([tagKey, value]: [string, Tag]) => {
                        set.buttonList = Object.values(set.buttonList).map((value: ButtonData) => {
                            if (value.tag === Number(tagKey)) {
                                value.tag = state.nextTagId;
                            }
                            return value;
                        })

                        tempTags[state.nextTagId] = {
                            ...value,
                            id: state.nextTagId++
                        }
                    })

                    Object.values(set.buttonList).forEach((value: ButtonData) => {
                        tempButtonList[state.nextButtonId] = {
                            ...value,
                            id: state.nextButtonId++
                        }
                    })
                }

                state.sets[state.nextSetId] = {
                    version: "1.1",
                    id: state.nextSetId,
                    tags: tempTags,
                    buttonList: tempButtonList,
                    name: set.name,
                }

                console.log(state.sets[state.nextSetId])
            }

            state.nextSetId++;
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

            delete state.sets[setId].buttonList[id]

            document.cookie = "buttonSetsList=" + JSON.stringify(state);
        }
    }
})

export const {
    addButtonToSet,
    updateButtonOfSet,
    deleteButtonOfSet,
    deleteTagFromSet,
    addTagToSet,
    editTagOfSet,
    addNewSet,
    sendNewButtonList,
    setSelectedSet
} = buttonSetSlice.actions

export default buttonSetSlice.reducer