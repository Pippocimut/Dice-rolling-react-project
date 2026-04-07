import { selectCurrentTrigger, setTrigger, type RollTrigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";

export const useEquations = () => {
    const trigger = useSelector(selectCurrentTrigger) as RollTrigger

    const dispatch = useDispatch()
    const updateRoll = (trigger: RollTrigger) => {
        dispatch(setTrigger({ trigger }))
    }

    const handleFormulaChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({
            ...trigger,
            equations: {
                ...trigger.equations,
                [id]: {
                    ...trigger.equations[id],
                    formula: e.currentTarget.value
                }
            }
        });
    };

    const addEquation = () => {
        const newEquations = { ...trigger.equations }
        const nextEquationId = trigger.nextEquationId

        newEquations[nextEquationId] = {
            id: nextEquationId,
            formula: `${1}d${20}+0`,
            nextSideEffectId: 1,
        }

        updateRoll({
            ...trigger,
            equations: newEquations,
            nextEquationId: nextEquationId + 1
        })
    }

    const deleteEquation = (id: number) => () => {
        const newEquations = { ...trigger.equations }
        delete newEquations[id]
        updateRoll({ ...trigger, equations: newEquations });
    }

    return {
        deleteEquation,
        handleFormulaChange,
        addEquation
    }
}