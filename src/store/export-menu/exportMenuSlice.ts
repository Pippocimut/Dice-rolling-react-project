import {createSlice} from "@reduxjs/toolkit";
import type {ButtonData, ButtonSet, Tag} from "../button-sets/buttonSetSlice.ts";

export type exportMenuState = {
    sets: number[],
    tags: Record<number, number[]>,
    buttons: Record<number, number[]>
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
            if (state.sets?.includes(newSet.id)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet !== newSet.id)
            } else {
                state.sets.push(newSet.id);
                state.tags[newSet.id] = [...state.tags[newSet.id] ?? [], ...newSet.tags.map(tag => tag.id)];
                state.buttons[newSet.id] = [...state.buttons[newSet.id] ?? [], ...newSet.buttonList.map(button => button.id)];
            }
        },
        onCheckedTagsChange: (state, action: {
            payload: { setID: number, newTag: Tag, relatedButtons: number[] }
        }) => {
            const {setID, newTag, relatedButtons} = action.payload;

            if (state.tags[setID]?.includes(newTag.id)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet != setID)
                state.tags[setID] = state.tags[setID].filter((checkedTag) => checkedTag !== newTag.id)

            } else {

                state.tags[setID] = state.tags[setID] ?? []
                state.tags[setID].push(newTag.id)

                state.buttons[setID] = state.buttons[setID] ?? []
                state.buttons[setID]?.push(...relatedButtons)
            }

        },
        onCheckedButtonsChange: (state, action: {
            payload: { setID: number, newButton: ButtonData }
        }) => {
            const {setID, newButton} = action.payload;
            if (state.buttons[setID]?.includes(newButton.id)) {
                state.sets = state.sets.filter((checkedSet) => checkedSet != setID);
                state.buttons[setID] = state.buttons[setID]?.filter((checkedButton) => checkedButton !== newButton.id) ?? []
                state.tags[setID] = state.tags[setID]?.filter((checkedTag) => checkedTag != newButton.tag) ?? [];

            } else {
                state.buttons[setID] = state.buttons[setID] ?? [];
                state.buttons[setID].push(newButton.id);
            }
        },
        selectAllSets: (state, action: {
            payload: { buttonSets: ButtonSet[] }
        }) => {
            const {buttonSets} = action.payload

            state.sets = buttonSets.map(set => set.id)
            state.tags = {
                ...buttonSets.reduce((acc, set) => {
                    acc[set.id] = set.tags.map(tag => tag.id)
                    return acc
                }, {} as Record<number, number[]>)
            }
            state.buttons = {
                ...buttonSets.reduce((acc, set) => {
                    acc[set.id] = set.buttonList.map(button => button.id)
                    return acc
                }, {} as Record<number, number[]>)
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