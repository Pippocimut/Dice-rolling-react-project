import {Input} from "@/components/ui/input.tsx";
import type {Roll} from "../../../../../types.ts";
import {type PropsWithChildren} from "react";
import {Label} from "@radix-ui/react-label";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

type Props = {
    roll: Roll,
    updateRoll: (roll: Roll) => void;
};

const RollHandlingDialogContent = ({roll, updateRoll, children}: PropsWithChildren<Props>) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({...roll, name: e.target.value});
    };

    const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({...roll, equation: e.target.value});
    };

    return (
        <DialogContent className={"flex flex-col w-fit gap-4 justify-start items-start"}>
            <DialogHeader>
                <DialogTitle>
                    Roll handling form
                </DialogTitle>
                <DialogDescription>
                    Fill in the form to create a new roll or update an existing one.
                </DialogDescription>
            </DialogHeader>
            <div>
                <Label htmlFor={"rollName"}>Roll name: </Label>
                <Input placeholder={"Roll Name"} value={roll.name} id={"rollName"} onChange={handleNameChange}/>
            </div>
            <div>
                <Label htmlFor={"rollEquation"}>Equation: </Label>
                <Input id={"rollEquation"} placeholder={"Equation"} value={roll.equation}
                       onChange={handleEquationChange}/>
            </div>
            <DialogFooter className={"flex flex-row gap-2 w-full justify-end items-center"}>
                {children}
            </DialogFooter>
        </DialogContent>
    );
};

export default RollHandlingDialogContent;
