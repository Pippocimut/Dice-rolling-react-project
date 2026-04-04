import { useEffect, useState } from "react";
import { TriggerHandlingDialogContent } from "./components/TriggerDialogContent.tsx";
import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type RollTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { setRoll } from "@/store/buttonManageSlice.ts";
import type { RootState } from "@/store";

type Props = {
    createRoll: (trigger: Trigger) => void;
};

const defaultRoll: RollTrigger = {
    id: -1,
    name: "New roll",
    type: "roll",
    onRoll: true,
    nextEquationId: 2,
    equations: {
        [1]: {
            id: 1,
            formula: `${1}d${20}+0`,
            nextSideEffectId: 1,
            sideEffects: {}
        }
    }
}

const CreateTriggerDialog = ({ createRoll }: Props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const roll = useSelector((state: RootState) => state.buttonManage.trigger);

    useEffect(() => {
        dispatch(setRoll(defaultRoll))
    }, [openDialog]);

    return (<Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <form className={"w-fit"}>
            <DialogTrigger asChild>
                <Button variant={"outline"} onClick={() => setOpenDialog(true)}>Add Roll Action</Button>
            </DialogTrigger>
            <TriggerHandlingDialogContent>
                <DialogClose asChild>
                    <Button
                        className={"bg-blue-500 hover:bg-blue-600 rounded-lg"}
                        onClick={() => {
                            createRoll(roll);
                        }}
                    >
                        Add Action
                    </Button>
                </DialogClose>
            </TriggerHandlingDialogContent>
        </form>
    </Dialog>
    );
};

export default CreateTriggerDialog