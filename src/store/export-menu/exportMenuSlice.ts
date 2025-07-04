import {createSlice} from "@reduxjs/toolkit";
import type {ButtonData, ButtonSet, Tag} from "../button-sets/buttonSetSlice.ts";

export type exportMenuState = {
    sets: string[],
    tags: Record<string, string[]>,
    buttons: Record<string, string[]>
}

const initialState: exportMenuState = {
    sets: [],
    tags: {},
    buttons: {},
}

const buttonSetSlice = createSlice({
    name: "exportMenu",
    initialState,
    reducers: {
        onCheckedSetChange: (state, action: { payload: ButtonSet }) => {
            const newSet = action.payload;
            if (state.sets?.includes(newSet.name)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet !== newSet.name)
            } else {
                state.sets.push(newSet.name);
                state.tags[newSet.name] = [...state.tags[newSet.name] ?? [], ...newSet.tags.map(tag => tag.name)];
                state.buttons[newSet.name] = [...state.buttons[newSet.name] ?? [], ...newSet.buttonList.map(button => button.name)];
            }
        },
        onCheckedTagsChange: (state, action: {
            payload: { setName: string, newTag: Tag, relatedButtons: string[] }
        }) => {
            const {setName, newTag, relatedButtons} = action.payload;

            if (state.tags[setName]?.includes(newTag.name)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet != setName)
                state.tags[setName] = state.tags[setName].filter((checkedTag) => checkedTag !== newTag.name)

            } else {

                state.tags[setName] = state.tags[setName] ?? []
                state.tags[setName].push(newTag.name)

                state.buttons[setName] = state.buttons[setName] ?? []
                state.buttons[setName]?.push(...relatedButtons)
            }

        },
        onCheckedButtonsChange: (state, action: {
            payload: { setName: string, newButton: ButtonData }
        }) => {
            const {setName, newButton} = action.payload;
            if (state.buttons[setName]?.includes(newButton.name)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet != setName);
                state.buttons[setName] = state.buttons[setName]?.filter((checkedButton) => checkedButton !== newButton.name) ?? []
                state.tags[setName] = state.tags[setName]?.filter((checkedTag) => checkedTag != newButton.tag) ?? [];

            } else {
                state.buttons[setName] = state.buttons[setName] ?? [];
                state.buttons[setName].push(newButton.name);
            }
        },
        selectAllSets: (state, action: {
            payload: { buttonSets: ButtonSet[] }
        }) => {
            const {buttonSets} = action.payload

            state.sets = buttonSets.map(set => set.name)
            state.tags = {
                ...buttonSets.reduce((acc, set) => {
                    acc[set.name] = set.tags.map(tag => tag.name)
                    return acc
                }, {} as Record<string, string[]>)
            }
            state.buttons = {
                ...buttonSets.reduce((acc, set) => {
                    acc[set.name] = set.buttonList.map(button => button.name)
                    return acc
                }, {} as Record<string, string[]>)
            }
        },
        clearAll: (state) => {
            state.sets = [];
            state.tags = {};
            state.buttons = {};
        }
    }
})

export const {
    onCheckedSetChange,
    onCheckedTagsChange,
    onCheckedButtonsChange,
    selectAllSets,
    clearAll
} = buttonSetSlice.actions

export default buttonSetSlice.reducer