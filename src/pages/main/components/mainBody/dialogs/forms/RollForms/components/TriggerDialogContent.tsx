import { Input } from "@/components/ui/input.tsx";
import { type PropsWithChildren } from "react";
import { Label } from "@radix-ui/react-label";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {
    RollTriggerSelection
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/components/RollTriggerSelection";
import {
    useRolls
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useRolls.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useEquations } from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useEquations.tsx";
import type { RollTrigger } from "@/store/button-sets/buttonSetSlice";
import { useSideEffects } from "../hooks/useSideEffects";
import { SideEffectList } from "../roll/SideEffectList";

export const TriggerSpecificAttributes = () => {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger)

    if (trigger.type === "roll") {
        return <RollTriggerHandlingDialogContent />
    }

    if (trigger.type === "text") {
        return <TextTriggerHandlingDialogContent />
    }

};

function TextTriggerHandlingDialogContent({ children }: PropsWithChildren) {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    if (roll.type !== "text") return null

    const { handleTextChange } = useRolls();

    return (
        <div
            className={"flex flex-col bg-background text-text gap-2 h-fit  w-full justify-start items-start"}>
            <Label htmlFor={"rollText"}>Text: </Label>
            <Input placeholder={"Text to display on roll"} value={roll.text} id={"rollText"} onChange={handleTextChange} />
        </div>

    )
}

function RollTriggerHandlingDialogContent() {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    if (roll.type !== "roll") return null

    const { addEquation } = useEquations()

    return (
        <div
            className={"flex flex-col bg-background text-text gap-2 h-fit  w-full justify-start items-start"}>
            <Label htmlFor={"rollEquation"}>Equations: </Label>
            <EquationList roll={roll} />
            <Button variant={"outline"} className={"w-fit"} onClick={addEquation}>Add Equation</Button>
        </div>
    )
}

export function TriggerHandlingDialogContent({ children }: PropsWithChildren) {
    const { handleNameChange } = useRolls();
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger)

    return (<DialogContent className={"flex flex-col gap-4 justify-start items-start"}>
        <DialogHeader>
            <DialogTitle>
                Roll handling form
            </DialogTitle>
            <DialogDescription>
                Fill in the form to create a new roll or update an existing one.
            </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 px-16"} />
        <TriggerTypeSelection />
        <div className={"flex flex-row justify-center items-center gap-4"}>
            <Label htmlFor={"rollTrigger"}>Trigger: </Label>
            <RollTriggerSelection />
        </div>
        <div>
            <Label htmlFor={"rollName"}>Roll name: </Label>
            <Input placeholder={"Roll Name"} value={trigger.name} id={"rollName"} onChange={handleNameChange} />
        </div>

        <TriggerSpecificAttributes />

        <DialogFooter className={"flex flex-row gap-2 w-full justify-end items-center"}>
            {children}
        </DialogFooter>
    </DialogContent>)
}

function TriggerTypeSelection() {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger)
    const { handleTriggerTypeChange } = useRolls()

    const triggerTypes = [
        { value: "roll", label: "Roll" },
        { value: "text", label: "Text" }
    ]

    return (
        <div className={"flex flex-row justify-center items-center gap-4"}>
            <Label htmlFor={"triggerType"}>Trigger Type: </Label>
            <DropdownMenu>
                <DropdownMenuTrigger asChild id={"trigger-type-dropdown-menu-trigger"}>
                    <Button variant="outline" className={"w-fit"}>
                        {triggerTypes.find(t => t.value === trigger.type)?.label || "Select Type"}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Trigger Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={trigger.type}
                        onValueChange={(value) => handleTriggerTypeChange(value as "roll" | "text")}
                    >
                        {triggerTypes.map((type) => (
                            <DropdownMenuRadioItem key={type.value} value={type.value}>
                                {type.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

const EquationList = ({ roll }: { roll: RollTrigger }) => {
    const {
        handleEquationChange,
        deleteEquation
    } = useEquations()

    const {
        addSideEffect
    } = useSideEffects()

    return <div className={"flex flex-col gap-2 justify-start items-center max-h-100 overflow-auto"}>
        {Object.values(roll.equations).map((currentEquation, index) => {
            if (currentEquation.id === -1) return
            return <div id={"equation-container-" + currentEquation.id} key={currentEquation.id + ""} className={"mx-3"}>
                {index != 0 && <p className={"text-4xl pb-2 font-black mx-auto w-fit"}>
                    +
                </p>}
                <div className={"flex flex-col items-start border-1 rounded-md py-3"}>
                    <div className={"flex flex-row gap-4 p-3 items-center w-fit"}>
                        <Input id={currentEquation.id + ""} placeholder={"Equation"} value={currentEquation.formula}
                            onChange={handleEquationChange(currentEquation.id)} />

                        <Button id={"add-side-effect"} variant={"outline"}
                            onClick={addSideEffect(currentEquation.id)}>Add Side Effect</Button>
                        <Button className={"text-danger w-1 h-2 ml-auto"} variant={"empty"}
                            onClick={deleteEquation(currentEquation.id)}>X</Button>

                    </div>
                    <SideEffectList equation={currentEquation} />
                </div>

            </div>
        })}
    </div>
}

