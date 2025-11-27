import {Dialog, DialogClose, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import RollHandlingDialogContent
    from "@/pages/main/components/mainBody/dialogs/forms/RollForms/RollHandlingDialogContent.tsx";
import {useEffect, useState} from "react";
import type {Roll} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";
import type {RootState} from "@/store";

type Props = {
    roll: Roll;
    updateRoll: (roll: Roll) => void;
}

export function EditRollDialog(props: Props) {
    const dispatch = useDispatch();
    const roll = useSelector((state:RootState)=> state.buttonManage.roll)
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(setRoll(props.roll))
    }, [openDialog]);

    return (<Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <form className={"w-fit"}>
                <DialogTrigger asChild>
                    <Button variant={"outline"} onClick={() => setOpenDialog(true)}>
                        <p>
                            <span className={"font-bold"}>{props.roll.name}</span>
                        </p>
                    </Button>
                </DialogTrigger>
                <RollHandlingDialogContent>
                    <DialogClose>
                        <Button className={"bg-green-500 hover:bg-green-600"} onClick={() => props.updateRoll(roll)}>
                            Update Roll
                        </Button>
                    </DialogClose>
                </RollHandlingDialogContent>
            </form>
        </Dialog>
    )
}