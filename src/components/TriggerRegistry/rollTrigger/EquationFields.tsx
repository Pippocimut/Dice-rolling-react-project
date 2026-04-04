import {
    EquationConditionSelection
} from "@/components/TriggerRegistry/rollTrigger/EquationConditionSelection";
import {
    EquationValueSelection
} from "@/components/TriggerRegistry/rollTrigger/EquationValueSelection";
import type { Equation, RollTrigger, SideEffect, Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { Button } from "@/components/ui/button.tsx";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setRoll } from "@/store/buttonManageSlice.ts";
import { useMemo } from "react";
import { useSideEffects } from "../../../pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useSideEffects";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GeneralTriggersV12 } from "@/store/button-sets/ButtonSetV1.2";

type Props = {
    currentEquation: Equation,
    sideEffect: SideEffect
};

export const EquationFields = ({
    currentEquation, sideEffect
}: Props) => {

    const trigger = useSelector((state: RootState) => state.buttonManage.trigger)
    if (trigger.type !== "roll") return null
    const dispatch = useDispatch()
    const updateRoll = (roll: RollTrigger) => {
        dispatch(setRoll(roll))
    }

    const deleteSideEffect = (equationId: number) => (sideEffectId: number) => () => {
        const newEquation = { ...trigger.equations[equationId] }

        if (newEquation.sideEffects === undefined) return

        const sideEffects = { ...newEquation.sideEffects }
        delete sideEffects[sideEffectId]

        newEquation.sideEffects = sideEffects

        updateRoll({
            ...trigger,
            equations: {
                ...trigger.equations,
                [equationId]: newEquation
            }
        })

    }

    return <div className={"flex flex-col gap-4 items-center justify-center p-2 m-2 border-t-1 border-b-1 w-full"}
        key={sideEffect.id}>
        <div className={"flex flex-row  gap-4 items-center"}>
            When
            <EquationConditionSelection currentEquation={currentEquation} sideEffectId={sideEffect.id} />
            <EquationValueSelection currentEquation={currentEquation} sideEffectId={sideEffect.id} />
            <Button className={"text-red-700"} variant={"empty"}
                onClick={deleteSideEffect(currentEquation.id)(sideEffect.id)}>X</Button>

        </div>
        <div className={"flex flex-row gap-4 items-center justify-start ml-4"}>
            then
            <EquationTriggerSelection equation={currentEquation} sideEffectId={sideEffect.id} />
        </div>
    </div>
}


type EquationTriggerSelectionProps = {
    equation: Equation,
    sideEffectId: number,
}

const EquationTriggerSelection = ({
    equation,
    sideEffectId
}: EquationTriggerSelectionProps) => {
    const currentSideEffect = useMemo(() =>
        equation?.sideEffects ? equation.sideEffects[sideEffectId] : undefined,
        [equation, sideEffectId]
    );

    const button = useSelector((state: RootState) => state.buttonManage.button)
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)

    const currentSideEffectId = currentSideEffect?.triggerId === roll.id ? -1 : currentSideEffect?.triggerId ?? -1
    //const [openTriggerDialog, setOpenTriggerDialog] = useState<boolean>(false)
    const currentTrigger = button.triggers[currentSideEffectId]

    const handleTriggerChange = (triggerId: string) => {
        const triggerIdNumber = parseInt(triggerId)
        if (Number.isNaN(triggerIdNumber)) return
        handleTriggerChangeSideEffects(equation.id)(sideEffectId)(triggerIdNumber)
    };

    const {
        handleTriggerChange: handleTriggerChangeSideEffects
    } = useSideEffects()

    if (currentSideEffect === undefined) return null
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={"tag-dropdown-menu-trigger"} aria-label="Select trigger">
                <Button variant="outline"
                    className={"w-fit"}>{currentTrigger?.name ?? "None"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trigger</DropdownMenuLabel>
                <   DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={currentTrigger?.name || "None"} onValueChange={handleTriggerChange}>
                    <DropdownMenuRadioItem value={GeneralTriggersV12.None + ""} key={GeneralTriggersV12.None}>None</DropdownMenuRadioItem>
                    <TriggerList triggers={Object.values(button.triggers)} />
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}

const TriggerList = ({ triggers }: { triggers: Trigger[] }) => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    return <>
        {triggers.map((currentTrigger, index) => {
            if (currentTrigger.id === 0 || currentTrigger.name === "" || currentTrigger.id === roll.id) return null
            return <DropdownMenuRadioItem key={index} value={currentTrigger.id + ""}>{currentTrigger.name}</DropdownMenuRadioItem>
        })}
    </>
}