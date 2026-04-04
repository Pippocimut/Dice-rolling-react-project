import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TriggerHandlingDialogContent }
    from "@/pages/main/components/mainBody/dialogs/forms/RollForms/components/TriggerDialogContent";
import { useEffect, useState } from "react";
import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { setRoll } from "@/store/buttonManageSlice.ts";
import type { RootState } from "@/store";

type Props = {
    trigger: Trigger;
    updateTrigger: (trigger: Trigger) => void;
}

export function EditTriggerDialog(props: Props) {
    const dispatch = useDispatch();
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(setRoll(props.trigger))
    }, [openDialog]);

    return (<Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <form className={"w-fit"}>
            <DialogTrigger asChild>
                <Button variant={"outline"} onClick={() => setOpenDialog(true)}>
                    <p>
                        <span className={"font-bold"}>{props.trigger.name}</span>
                    </p>
                </Button>
            </DialogTrigger>
            <TriggerHandlingDialogContent>
                <DialogClose>
                    <Button className={"bg-green-500 hover:bg-green-600"} onClick={() => props.updateTrigger(roll)}>
                        Update Roll
                    </Button>
                </DialogClose>
            </TriggerHandlingDialogContent>
        </form>
    </Dialog>
    )
}