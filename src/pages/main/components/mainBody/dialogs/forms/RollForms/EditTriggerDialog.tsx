import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TriggerHandlingDialogContent }
    from "@/pages/main/components/mainBody/dialogs/forms/RollForms/components/TriggerDialogContent";
import { useEffect, useState } from "react";
import { setSelectedTriggerId, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, } from "react-redux";


type Props = {
    trigger: Trigger;
    updateTrigger: (trigger: Trigger) => void;
}

export function EditTriggerDialog(props: Props) {
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(setSelectedTriggerId(props.trigger.id))
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
                    <Button className={"bg-green-500 hover:bg-green-600"} onClick={() => props.updateTrigger(props.trigger)}>
                        Update Roll
                    </Button>
                </DialogClose>
            </TriggerHandlingDialogContent>
        </form>
    </Dialog>
    )
}