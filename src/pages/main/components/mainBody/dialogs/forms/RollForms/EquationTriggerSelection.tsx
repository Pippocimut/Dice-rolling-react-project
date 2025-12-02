import type {Equation, Trigger} from "@/store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useMemo} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSideEffects} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useSideEffects.tsx";
import {GeneralTriggersV12} from "@/store/button-sets/ButtonSetV1.2.ts";


type Props = {
    equation: Equation,
    sideEffectId: number,
}

export const EquationTriggerSelection = ({
                                             equation,
                                             sideEffectId
                                         }: Props) => {
    const currentSideEffect = useMemo(() =>
            equation?.sideEffects ? equation.sideEffects[sideEffectId] : undefined,
        [equation, sideEffectId]
    );

    const button = useSelector((state: RootState) => state.buttonManage.button)
    const roll = useSelector((state: RootState) => state.buttonManage.roll)

    const currentSideEffectId = currentSideEffect?.triggerId === roll.id? -1 : currentSideEffect?.triggerId??-1
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

    console.log(currentSideEffectId)

    if (currentSideEffect === undefined) return null
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={"tag-dropdown-menu-trigger"} aria-label="Select trigger">
                <Button variant="outline"
                        className={"w-fit"}>{currentTrigger?.name ?? "None"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trigger</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={currentTrigger?.name || "None"} onValueChange={handleTriggerChange}>
                    <DropdownMenuRadioItem value={GeneralTriggersV12.None + ""} key={GeneralTriggersV12.None}>None</DropdownMenuRadioItem>
                    <TriggerList triggers={Object.values(button.rolls)}/>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
}

const TriggerList = ({triggers}: { triggers: Trigger[] }) => {
    const roll = useSelector((state:RootState) => state.buttonManage.roll)
    return <>
        {triggers.map((currentTrigger, index) => {
            if ( currentTrigger.id === 0 || currentTrigger.name === "" || currentTrigger.id === roll.id) return null
            return <DropdownMenuRadioItem key={index} value={currentTrigger.id + ""}>{currentTrigger.name}</DropdownMenuRadioItem>
        })}
    </>
}