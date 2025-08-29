import type {Roll} from "../../../../../types.ts";
import {useState} from "react";
import RollHandlingDialogContent from "./RollHandlingDialogContent.tsx";
import {Dialog, DialogClose, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    createRoll: (roll: Roll) => void;
};

const CreateRollDialog = ({createRoll}: Props) => {
    const [dummyRoll, updateDummyDummyRoll] = useState<Roll>({
        name: "New roll",
        equation: `${1}d${20}+0`,
    });

    return (<Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant={"outline"}>Add Roll</Button>
                </DialogTrigger>
                <RollHandlingDialogContent roll={dummyRoll} updateRoll={updateDummyDummyRoll}>
                    <DialogClose>
                        <Button
                            className={"bg-blue-500 hover:bg-blue-600 rounded-lg"}
                            onClick={() => {
                                createRoll(dummyRoll);
                            }}
                        >
                            Add Roll
                        </Button>
                    </DialogClose>
                </RollHandlingDialogContent>
            </form>
        </Dialog>
    );
};

export default CreateRollDialog