import { createSlice } from "@reduxjs/toolkit";
import {
    type ButtonData,
    colors,
    type RollTrigger, type Tag,
    type Trigger
} from "@/store/button-sets/buttonSetSlice.ts";
import { GeneralTriggersV12, SideEffectConditionsV12 } from "./button-sets/ButtonSetV1.2";


type buttonManagementState = {
    button: ButtonData,
    trigger: Trigger,
}



const initialState: buttonManagementState =
{
    button: {
        id: -1,
        name: "New Button",
        nextRollId: 1,
        tag: -1,
        nextTriggerId: 1,
        triggers: {},
        color: colors[Math.floor(Math.random() * colors.length)],
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
                        triggerId: GeneralTriggersV12.None,
                    },
                    [2]: {
                        id: 2,
                        condition: SideEffectConditionsV12.LessThan,
                        values: [20],
                        triggerId: GeneralTriggersV12.None,
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
        resetButton: (state, action: {
            payload: {
                tag: Tag | undefined
            } | undefined
        }) => {
            const tag = action.payload?.tag;
            if (tag !== undefined) {
                state.button = {
                    ...initialState.button,
                    ...tag.buttonConfig,
                    tag: tag.id,
                    color: tag.color
                }
            } else {
                state.button = initialState.button;
            }
        }
    }
})

export const {
    setButton,
    setButtonTriggers,
    setRoll,
    resetButton,
} = buttonManageSlice.actions

export default buttonManageSlice.reducer