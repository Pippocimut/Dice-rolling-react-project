import { createSlice } from "@reduxjs/toolkit";
import {
    type ButtonData,
    type ButtonPath,
    colors,
    type Trigger,
    type TriggerPath
} from "@/store/button-sets/buttonSetSlice.ts";
import { SideEffectConditionsV12 } from "./button-sets/ButtonSetV1.2";


type buttonManagementState = {
    button: ButtonData,
    trigger: Trigger,
    buttonPath?: ButtonPath,
    triggerPath?: TriggerPath
}

const initialState: buttonManagementState =
{
    button: {
        id: -1,
        name: "New Button",
        nextRollId: 1,
        isNotComplete: true,
        tag: -1,
        nextTriggerId: 1,
        triggers: {},
        color: "",
        position: -1
    },
    trigger: {
        name: "New roll",
        onRoll: true,
        type: "roll",
        nextEquationId: 2,
        id: -1,
        equations: {
            [1]: {
                id: 1,
                formula: `${1}d${20}+0`,
                nextSideEffectId: 3,
                sideEffects: {
                    [1]: {
                        id: 1,
                        condition: SideEffectConditionsV12.EqualTo,
                        values: [20],
                        target: null,
                    },
                    [2]: {
                        id: 2,
                        condition: SideEffectConditionsV12.LessThan,
                        values: [20],
                        target: null,
                    },
                }
            }
        }
    }
}

const buttonManageSlice = createSlice({
    name: "buttonManage",
    initialState,
    reducers: {
        setButton: (state, action) => {
            state.button = action.payload;
        },
        addRollToButton: (state, action) => {
            const roll = action.payload;
            state.button.triggers[roll.id] = roll;
        },
        setButtonTriggers: (state, action) => {
            state.button.triggers = {
                ...action.payload
            }
        },
        setRoll: (state, action) => {
            state.trigger = action.payload;
        },
        setButtonPath: (state, action) => {
            state.buttonPath = action.payload;
        },
        setTriggerPath: (state, action) => {
            state.triggerPath = action.payload;
        },
    }
})

export const {
    setButton,
    setButtonTriggers,
    setRoll,
    setButtonPath,
    setTriggerPath,
} = buttonManageSlice.actions

export default buttonManageSlice.reducer