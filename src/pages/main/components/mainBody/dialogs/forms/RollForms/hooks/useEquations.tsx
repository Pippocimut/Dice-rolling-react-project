import type { Roll} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";

export const useEquations = () => {
    const roll = useSelector((state: RootState) => state.buttonManage.roll)
    const dispatch = useDispatch()
    const updateRoll = (roll: Roll) => {
        dispatch(setRoll(roll))
    }

    const handleFormulaChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({
            ...roll,
            equations: {
                ...roll.equations,
                [id]: {
                    ...roll.equations[id],
                    formula: e.currentTarget.value
                }
            }
        });
    };

    const addEquation = () => {
        const newEquations = {...roll.equations}
        const nextEquationId = roll.nextEquationId

        newEquations[nextEquationId] = {
            id: nextEquationId,
            formula: `${1}d${20}+0`,
            nextSideEffectId: 1,
        }

        updateRoll({
            ...roll,
            equations: newEquations,
            nextEquationId: nextEquationId + 1
        })
    }

    const deleteEquation = (id: number) => () => {
        const newEquations = {...roll.equations}
        delete newEquations[id]
        updateRoll({...roll, equations: newEquations});
    }

    return {
        deleteEquation,
        handleEquationChange: handleFormulaChange,
        addEquation
    }
}