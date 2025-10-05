import {Dialog, DialogClose, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import type {Roll} from "@/pages/main/types.ts";
import RollHandlingDialogContent from "@/pages/main/components/mainBody/dialogs/forms/RollForms/RollHandlingDialogContent.tsx";
import {useState} from "react";

type Props = {
    roll: Roll;
    updateRoll: (roll: Roll) => void;
}

export function EditRollDialog(props: Props) {
    const [dummyRoll, updateDummyDummyRoll] = useState<Roll>(props.roll);
    const onClickHandler = () => props.updateRoll(dummyRoll)

    return (<Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"}>
                        <p>
                            <span className={"font-bold"}>{props.roll.name}</span>
                        </p>
                    </Button>
                </DialogTrigger>
                <RollHandlingDialogContent roll={dummyRoll} updateRoll={updateDummyDummyRoll}>
                    <DialogClose>
                        <Button className={"bg-green-500 hover:bg-green-600"} onClick={onClickHandler}>
                            Update Roll
                        </Button>
                    </DialogClose>
                </RollHandlingDialogContent>
            </form>
        </Dialog>
    )
}