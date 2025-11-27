import {
    EquationConditionSelection
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EquationConditionSelection.tsx";
import {
    EquationValueSelection
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EquationValueSelection.tsx";
import {
    EquationTriggerSelection
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EquationTriggerSelection.tsx";
import type {Equation, Roll, SideEffect} from "@/store/button-sets/buttonSetSlice.ts";
import {Button} from "@/components/ui/button.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";

type Props = {
    currentEquation: Equation,
    sideEffect: SideEffect
};

export const EquationFields = ({
                                   currentEquation, sideEffect
                               }: Props) => {

    const roll = useSelector((state: RootState) => state.buttonManage.roll)
    const dispatch = useDispatch()
    const updateRoll = (roll: Roll) => {
        dispatch(setRoll(roll))
    }
    const deleteSideEffect = (equationId: number) => (sideEffectId: number) => () => {
        const newEquation = {...roll.equations[equationId]}

        if (newEquation.sideEffects === undefined) return

        const sideEffects = {...newEquation.sideEffects}
        delete sideEffects[sideEffectId]

        newEquation.sideEffects =sideEffects

        updateRoll({
            ...roll,
            equations: {
                ...roll.equations,
                [equationId]: newEquation
            }
        })

    }

    return <div className={"flex flex-col gap-4 items-start justify-start p-2 m-2 rounded-md border-1"}
                key={sideEffect.id}>
        <div className={"flex flex-row  gap-4 items-center"}>
            When
            <EquationConditionSelection currentEquation={currentEquation} sideEffectId={sideEffect.id}/>
            <EquationValueSelection currentEquation={currentEquation} sideEffectId={sideEffect.id}/>
            <Button className={"text-red-700"} variant={"empty"}
                    onClick={deleteSideEffect(currentEquation.id)(sideEffect.id)}>X</Button>

        </div>
        <div className={"flex flex-row gap-4 items-center justify-start ml-4"}>
            then
            <EquationTriggerSelection equation={currentEquation} sideEffectId={sideEffect.id}/>
        </div>
    </div>
}