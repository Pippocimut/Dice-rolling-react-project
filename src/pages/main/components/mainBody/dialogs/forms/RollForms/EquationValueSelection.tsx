import {type Equation, type Roll, type SideEffect} from "@/store/button-sets/buttonSetSlice.ts";
import {type ChangeEvent} from "react";
import {Input} from "@/components/ui/input.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";

export const EquationValueSelection = ({
                                           currentEquation,
                                           sideEffectId
                                       }: {
    currentEquation: Equation,
    sideEffectId: number,
}) => {
    const roll = useSelector((state: RootState) => state.buttonManage.roll)
    const dispatch = useDispatch()
    const updateRoll = (roll: Roll) => {
        dispatch(setRoll(roll))
    }
    const currentSideEffect = currentEquation?.sideEffects ? currentEquation?.sideEffects[sideEffectId] : undefined
    const handleValueChange = (index: number) => (e: ChangeEvent<HTMLInputElement>
    ) => {
        const equations = {...roll.equations}
        const values = [...currentSideEffect?.values ?? []]
        if (values[index] === undefined)
            values.push(parseInt(e.currentTarget.value))
        else
            values[index] = parseInt(e.currentTarget.value)

        equations[currentEquation.id] = {
            ...equations[currentEquation.id],
            sideEffects: {
                ...equations[currentEquation.id].sideEffects,
                [sideEffectId]: {
                    ...equations[currentEquation.id].sideEffects![sideEffectId],
                    values: values
                } as SideEffect
            }
        } as Equation
        updateRoll({
            ...roll,
            equations
        })

    }

    if (currentSideEffect === undefined) return
    if (currentSideEffect.condition === "Between")
        return <>
            <Input type="number" value={currentSideEffect.values[0]} onChange={handleValueChange(0)}
                   className={"w-20"}/>
            <Input type="number" value={currentSideEffect.values[1]} onChange={handleValueChange(1)}
                   className={"w-20"}/>
        </>
    if (currentSideEffect.condition === "Not between") return <>
        <Input type="number" value={currentSideEffect.values[0]} onChange={handleValueChange(0)} className={"w-20"}/>
        <Input type="number" value={currentSideEffect.values[1]} onChange={handleValueChange(1)} className={"w-20"}/>
    </>

    if (currentSideEffect.condition === "Always") return
    return <Input type="number" value={currentSideEffect.values[0]} onChange={handleValueChange(0)} className={"w-20"}/>
}