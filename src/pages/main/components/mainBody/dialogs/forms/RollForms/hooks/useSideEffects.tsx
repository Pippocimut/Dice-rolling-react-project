import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { type Equation, type RollTrigger, type SideEffect, type TriggerPath } from "@/store/button-sets/buttonSetSlice.ts";
import { setRoll } from "@/store/buttonManageSlice.ts";
import { SideEffectConditionsV12 } from "@/store/button-sets/ButtonSetV1.2.ts";

export const useSideEffects = () => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    const dispatch = useDispatch()
    const updateRoll = (roll: RollTrigger) => {
        dispatch(setRoll(roll))
    }

    const handleAddSideEffect = (equationId: number) => () => {
        if (roll.equations[equationId] === undefined) return (
            console.error("Equation not found")
        )

        updateRoll({
            ...roll,
            equations: {
                ...roll.equations,
                [equationId]: createNewDefaultSideEffectForEquation(roll.equations[equationId])
            }
        })
    }

    const handleTriggerChange = (equationId: number) => (sideEffectId: number) => (target: TriggerPath | null) => {
        const equations = { ...roll.equations };
        equations[equationId] = {
            ...equations[equationId],
            sideEffects: {
                ...equations[equationId].sideEffects,
                [sideEffectId]: {
                    ...equations[equationId].sideEffects![sideEffectId],
                    target,
                } as SideEffect
            }
        };

        updateRoll({
            ...roll,
            equations
        });
    };

    return { addSideEffect: handleAddSideEffect, handleTriggerChange }
};

const createNewDefaultSideEffectForEquation = (equation: Equation) => {
    return {
        ...equation,
        nextSideEffectId: equation.nextSideEffectId + 1,
        sideEffects: {
            ...equation.sideEffects,
            [equation.nextSideEffectId]: {
                ...defaultSideEffect,
                id: equation.nextSideEffectId,
            }
        }
    }
}

const defaultSideEffect: SideEffect = {
    id: -1,
    condition: SideEffectConditionsV12.EqualTo,
    values: [20],
    target: null,
}
