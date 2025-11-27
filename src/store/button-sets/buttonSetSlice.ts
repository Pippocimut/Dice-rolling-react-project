import {createSlice} from "@reduxjs/toolkit";
import {defaultTags} from "@/store/button-sets/defaultTags.ts";
import {
    type BaseButtonSetV12,
    type ButtonDataV12, type ButtonSetStateV12, type ButtonSetV12, colorsV12,
    type EquationRecordV12, type EquationV12, type RollMapV12,
    type RollV12,
    type SideEffectsMapV12,
    type SideEffectV12,
    type TagV12, type TriggersMapV12, type TriggerV12
} from "@/store/button-sets/ButtonSetV1.2.ts";
import {ImportManager} from "@/store/button-sets/import.ts";

export type Roll = RollV12
export type EquationRecord = EquationRecordV12
export type SideEffect = SideEffectV12
export type SideEffectsMap = SideEffectsMapV12
export type Equation = EquationV12
export type Tag = TagV12
export type Trigger = TriggerV12
export type TriggersMap = TriggersMapV12
export type RollMap = RollMapV12
export type ButtonData = ButtonDataV12
export type BaseButtonSet = BaseButtonSetV12
export type ButtonSet = ButtonSetV12
type buttonSetState = ButtonSetStateV12
export const colors = colorsV12

const initialState: buttonSetState = localStorage.getItem("buttonSetsList")
        ? JSON.parse(localStorage.getItem("buttonSetsList") ?? "") as buttonSetState
        : {
            nextSetId: 2,
            nextTagId: 4,
            nextButtonId: 1,
            currentVersion: "1.2",
            selectedSetId: 1,
            sets: {
                1: {
                    id: 1,
                    version: "1.2",
                    name: "Default",
                    tags: defaultTags,
                    buttonList: {}
                }
            }
        } as buttonSetState


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
            const button = {...action.payload.button};

            const set = state.sets[setId];

            if (!set) return;

            if (button.id == -1) {
                button.id = state.nextButtonId;
                state.nextButtonId++;
            }

            if (button.position == -1) {
                button.position = button.id
            }

            set.buttonList = {
                ...set.buttonList,
                [button.id]: button
            }

            state.sets[setId] = set;

            const stringState = JSON.stringify(state)
            localStorage.setItem("buttonSetsList", stringState);
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

            const idToDelete = Object.values(set.buttonList).filter(button => button.tag === tagId).map(button => button.id);
            idToDelete.forEach(id => delete set.buttonList[id]);

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
            state.sets[setId].buttonList = buttons.reduce((acc, button) => {
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

            delete state.sets[setId].buttonList[id]

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
    sendNewButtonList,
    setSelectedSet
} = buttonSetSlice.actions

export default buttonSetSlice.reducer