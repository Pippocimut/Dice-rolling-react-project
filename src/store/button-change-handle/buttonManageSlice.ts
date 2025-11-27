import {createSlice} from "@reduxjs/toolkit";
import {
    type ButtonData,
    colors,
    type Roll, type Tag
} from "@/store/button-sets/buttonSetSlice.ts";
import { defaultTriggers } from "../button-sets/defaultTags";
import { GeneralTriggersV12, SideEffectConditionsV12 } from "../button-sets/ButtonSetV1.2";

type buttonManagementState = {
    button: ButtonData,
    roll: Roll,
}

const initialState: buttonManagementState =
    {
        button: {
            id: -1,
            name: "New Button",
            nextRollId: 1,
            rolls: {},
            tag: -1,
            nextTriggerId: 1,
            triggers: {
                [GeneralTriggersV12.OnRoll]: {
                    id: GeneralTriggersV12.OnRoll,
                    name: "On roll"
                }
            },
            color: colors[Math.floor(Math.random() * colors.length)],
            position: -1
        },
        roll: {
            name: "New roll",
            trigger: GeneralTriggersV12.OnRoll,
            nextEquationId: 2,
            id:-1,
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
        setButtonRolls: (state, action) => {
            state.button.rolls = action.payload;
            state.button.triggers = {
                ...defaultTriggers,
                ...action.payload
            }
        },
        setRoll: (state, action) => {
            state.roll = action.payload;
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
                }
            } else {
                state.button = initialState.button;
            }
        }
    }
})

export const {
    setButton,
    setButtonRolls,
    setRoll,
    resetButton,
} = buttonManageSlice.actions

export default buttonManageSlice.reducer