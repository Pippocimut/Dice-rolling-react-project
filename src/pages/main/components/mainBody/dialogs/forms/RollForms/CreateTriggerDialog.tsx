import { useEffect, useState } from "react";
import { TriggerHandlingDialogContent } from "./components/TriggerDialogContent.tsx";
import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { createNewBlankTrigger, selectCurrentButton, selectCurrentTrigger, type RollTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";

type Props = {
    createRoll: (trigger: Trigger) => void;
};

const CreateTriggerDialog = ({ createRoll }: Props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const trigger = useSelector(selectCurrentTrigger)!;
    const selectedButton = useSelector(selectCurrentButton)!

    useEffect(() => {
        dispatch(createNewBlankTrigger({ setId: selectedSetId, buttonId: selectedButton.id }))
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
                            createRoll(trigger);
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