import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTrigger, setTrigger, type Equation, type RollTrigger, type SideEffect, type TriggerPath } from "@/store/button-sets/buttonSetSlice.ts";
import { SideEffectConditionsV12 } from "@/store/button-sets/ButtonSetV1.2.ts";

export const useSideEffects = () => {
    const trigger = useSelector(selectCurrentTrigger) as RollTrigger

    const dispatch = useDispatch()
    const updateRoll = (trigger: RollTrigger) => {
        dispatch(setTrigger({ trigger }))
    }

    const handleAddSideEffect = (equationId: number) => () => {
        if (trigger.equations[equationId] === undefined) return (
            console.error("Equation not found")
        )

        updateRoll({
            ...trigger,
            equations: {
                ...trigger.equations,
                [equationId]: createNewDefaultSideEffectForEquation(trigger.equations[equationId])
            }
        })
    }

    const handleDeleteSideEffect = (equationId: number) => (sideEffectId: number) => () => {
        const equations = { ...trigger.equations };
        if (equations[equationId].sideEffects === undefined) return

        const sideEffects = { ...equations[equationId].sideEffects }
        delete sideEffects[sideEffectId]

        equations[equationId] = {
            ...equations[equationId],
            sideEffects
        }

        updateRoll({
            ...trigger,
            equations
        })
    }

    const handleTriggerChange = (equationId: number) => (sideEffectId: number) => (target: TriggerPath | null) => {
        const equations = { ...trigger.equations };
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
            ...trigger,
            equations
        });
    };

    const handleConditionChange = (equationId: number) => (sideEffectId: number) => (condition: SideEffectConditionsV12 | "None") => {
        const equations = { ...trigger.equations };
        equations[equationId] = {
            ...equations[equationId],
            sideEffects: {
                ...equations[equationId].sideEffects,
                [sideEffectId]: {
                    ...equations[equationId].sideEffects![sideEffectId],
                    condition: condition === "None" ? undefined : condition,
                } as SideEffect
            }
        };

        updateRoll({
            ...trigger,
            equations
        });
    };

    return { handleDeleteSideEffect, addSideEffect: handleAddSideEffect, handleTriggerChange, handleConditionChange }
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
