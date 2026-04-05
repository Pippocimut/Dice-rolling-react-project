import { createSlice } from "@reduxjs/toolkit";
import { defaultTags } from "@/store/button-sets/defaultTags.ts";
import {
    type ButtonSetV12, colorsV12,
} from "@/store/button-sets/ButtonSetV1.2.ts";
import { ImportManager } from "@/store/button-sets/import.ts";
import type { BaseButtonSetV13, ButtonDataV13, ButtonSetStateV13, ButtonSetV13, ButtonTriggerV13, EquationRecordV13, EquationV13, RollTriggerV13, SideEffectsMapV13, SideEffectV13, TagV13, TextTriggerV13, TriggersMapV13, TriggerV13 } from "./ButtonSetV1.3";
import { makePath, type ButtonPath, type TriggerPath } from "@/store/button-sets/paths";
import type { RootState } from "@/store";

export type RollTrigger = RollTriggerV13
export type TextTrigger = TextTriggerV13
export type ButtonTrigger = ButtonTriggerV13
export type { SetPath, ButtonPath, TriggerPath, EntityPath, PathSegment } from "@/store/button-sets/paths"
export { makePath, pathToString } from "@/store/button-sets/paths"
export { resolveEntity } from "@/store/button-sets/resolveEntity"
export type EquationRecord = EquationRecordV13
export type SideEffect = SideEffectV13
export type SideEffectsMap = SideEffectsMapV13
export type Equation = EquationV13
export type Tag = TagV13
export type Trigger = TriggerV13
export type TriggersMap = TriggersMapV13
export type ButtonData = ButtonDataV13
export type BaseButtonSet = BaseButtonSetV13
export type ButtonSet = ButtonSetV13
type ButtonSetState = ButtonSetStateV13
export const colors = colorsV12

export const selectCurrentButtonPath = (state: RootState) => state.buttonSet.buttonPath
export const selectCurrentButton = (state: RootState) => {
    const set = state.buttonSet.sets[state.buttonSet.selectedSetId]
    const button = set.buttons[state.buttonSet.selectedButtonId]
    return button
}

export const selectCurrentTriggerPath = (state: RootState) => state.buttonSet.triggerPath
export const selectCurrentTrigger = (state: RootState) => {
    const set = state.buttonSet.sets[state.buttonSet.selectedSetId]
    const button = set.buttons[state.buttonSet.selectedButtonId]
    const trigger = button.triggers[state.buttonSet.selectedTriggerId]

    return trigger
}

export const defaultButton: ButtonData = {
    id: -1,
    name: "New Button",
    nextRollId: 1,
    tag: -1,
    isNotComplete: true,
    nextTriggerId: 1,
    triggers: {},
    color: colors[Math.floor(Math.random() * colors.length)],
    position: -1
}

export const defaultTrigger: Trigger = {
    id: -1,
    name: "New Trigger",
    onRoll: true,
    isNotComplete: true,
    type: "text",
    text: "Trigger text"
}


const initialState: ButtonSetState = localStorage.getItem("buttonSetsList")
    ? JSON.parse(localStorage.getItem("buttonSetsList") ?? "") as ButtonSetState
    : {
        nextSetId: 2,
        nextTagId: 4,
        nextButtonId: 1,
        currentVersion: "1.2",
        selectedSetId: 1,
        selectedButtonId: -1,
        selectedTriggerId: -1,
        sets: {
            1: {
                id: 1,
                version: "1.3",
                name: "Default",
                tags: defaultTags,
                buttons: {}
            }
        }
    } as ButtonSetState


const buttonSetSlice = createSlice({
    name: "buttonSet",
    initialState,
    reducers: {
        setSelectedSet: (state, action) => {
            state.selectedSetId = action.payload;
            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        upsertButtonOfSet: (state, action: {
            payload: {
                setId: number,
                button: ButtonData,
            }
        }) => {
            const setId = action.payload.setId;
            const button = { ...action.payload.button };

            const set = state.sets[setId];

            if (!set) return;

            if (button.id == -1) {
                button.id = state.nextButtonId;
                state.nextButtonId++;
            }

            if (button.position == -1) {
                button.position = button.id
            }

            button.triggers = Object.fromEntries(
                Object.entries(button.triggers).filter(([key, trigger]) => !trigger?.isNotComplete)
            )

            console.log("Button is slice", button)

            set.buttons = {
                ...set.buttons,
                [button.id]: button
            }

            state.sets[setId] = set;

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        setSelectedButtonId: (state, action) => {
            state.selectedButtonId = action.payload
        },
        setSelectedTriggerId: (state, action) => {
            state.selectedTriggerId = action.payload
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

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
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

            const idToDelete = Object.values(set.buttons).filter(button => button.tag === tagId).map(button => button.id);
            idToDelete.forEach(id => delete set.buttons[id]);

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
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

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
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
            state.sets[setId].buttons = buttons.reduce((acc, button) => {
                acc[button.id] = button;
                return acc;
            }, {} as Record<number, ButtonData>)

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        addNewSet: (state, action: { payload: ButtonSet }) => {
            const set = action.payload;
            const importingUtil = new ImportManager()

            importingUtil.from(set)
            const convertedSet = importingUtil.convert() as ButtonSetV12
            convertedSet.id = state.nextSetId;
            state.sets[state.nextSetId] = convertedSet
            state.nextSetId++;
            state.selectedSetId = convertedSet.id;
            const highest_tag_id = Math.max(...Object.keys(convertedSet.tags).map(key => parseInt(key)))
            state.nextTagId = Math.max(highest_tag_id + 1, state.nextTagId);

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        deleteButtonOfSet: (state, action: {
            payload: {
                setId: number
                id: number
            }
        }) => {
            const setId = action.payload.setId;
            const id = action.payload.id;

            delete state.sets[setId].buttons[id]

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        setTrigger(state, action: {
            payload: {
                trigger: Trigger,
                triggerPath: TriggerPath
            }
        }) {
            const { trigger, triggerPath } = action.payload
            const setId = triggerPath[0].id
            const buttonId = triggerPath[1].id;
            const triggerId = triggerPath[2].id;
            const set = state.sets[setId]
            if (!set) return;
            const button = set.buttons[buttonId]
            if (!button) return;
            button.triggers[triggerId] = trigger

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        createNewBlankTrigger: (state, action: {
            payload: {
                setId: number,
                buttonId: number
            }
        }) => {
            const { setId, buttonId } = action.payload
            const set = state.sets[setId]
            if (!set) return;
            const button = { ...set.buttons[buttonId] }
            if (!button) return;

            const trigger = { ...defaultTrigger }

            trigger.id = button.nextTriggerId
            button.nextTriggerId++

            Object.values(button.triggers).map(trigger => {
                if (trigger.isNotComplete)
                    delete button.triggers[trigger.id]
            })

            button.triggers = {
                ...button.triggers,
                [trigger.id]: trigger
            }

            set.buttons[button.id] = button

            state.triggerPath = makePath.trigger(setId, buttonId, trigger.id)
            state.selectedTriggerId = trigger.id

            console.log("Trigger Id", trigger.id)
            console.log("Button", button)

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        },
        createNewBlankButton: (state, action: {
            payload: {
                setId: number,
                tag?: Tag
            }
        }) => {
            const setId = action.payload.setId;
            const tag = action.payload.tag;
            const set = state.sets[setId];
            if (!set) return;

            Object.values(set.buttons).forEach(button => {
                if (button.isNotComplete) {
                    delete set.buttons[button.id]
                }
            })

            const newButton: ButtonData = {
                ...defaultButton,
                ...tag?.buttonConfig,
                color: tag ? tag.color : defaultButton.color,
                tag: tag ? tag.id : -1,
                id: state.nextButtonId,
            }
            state.nextButtonId++;

            set.buttons[newButton.id] = newButton

            state.buttonPath = makePath.button(setId, newButton.id)
            state.selectedButtonId = newButton.id

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
        }
    }
})

export const {
    upsertButtonOfSet,
    deleteButtonOfSet,
    deleteTagFromSet,
    addTagToSet,
    editTagOfSet,
    addNewSet,

    createNewBlankButton,
    createNewBlankTrigger,

    sendNewButtonList,
    setSelectedSet,

    setTrigger,
    setSelectedTriggerId,
    setSelectedButtonId

} = buttonSetSlice.actions

export default buttonSetSlice.reducer