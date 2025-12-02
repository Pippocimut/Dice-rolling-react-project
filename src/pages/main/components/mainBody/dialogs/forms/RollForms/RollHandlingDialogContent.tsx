import {Input} from "@/components/ui/input.tsx";
import {type PropsWithChildren} from "react";
import {Label} from "@radix-ui/react-label";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    RollTriggerSelection
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/RollTriggerSelection.tsx";
import {
    useRolls
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useRolls.tsx";
import {EquationList} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/EquationList.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useEquations} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useEquations.tsx";

const RollHandlingDialogContent = ({children}: PropsWithChildren) => {
    const roll = useSelector((state: RootState) => state.buttonManage.roll)
    const button = useSelector((state: RootState) => state.buttonManage.button)

    const {handleNameChange} = useRolls();

    const {addEquation} = useEquations()

    console.log(roll)
    console.log(button)

    return <DialogContent className={"flex flex-col gap-4 justify-start items-start"}
                          onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
            <DialogTitle>
                Roll handling form
            </DialogTitle>
            <DialogDescription>
                Fill in the form to create a new roll or update an existing one.
            </DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-4 px-16"}/>
        <div className={"flex flex-row justify-center items-center gap-4"}>
            <Label htmlFor={"rollTrigger"}>Trigger: </Label>
            <RollTriggerSelection/>
        </div>
        <div>
            <Label htmlFor={"rollName"}>Roll name: </Label>
            <Input placeholder={"Roll Name"} value={roll.name} id={"rollName"} onChange={handleNameChange}/>
        </div>
        <div
            className={"flex flex-col bg-background text-text gap-10 h-fit  w-full justify-start items-start"}>
            <Label htmlFor={"rollEquation"}>Equations: </Label>
            <EquationList roll={roll}/>
            <Button variant={"outline"} className={"w-fit"} onClick={addEquation}>Add Equation</Button>
        </div>
        <DialogFooter className={"flex flex-row gap-2 w-full justify-end items-center"}>
            {children}
        </DialogFooter>
    </DialogContent>
};

export default RollHandlingDialogContent;

