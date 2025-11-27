import {useEffect, useState} from "react";
import RollHandlingDialogContent from "./RollHandlingDialogContent.tsx";
import {Dialog, DialogClose, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {type Roll} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {setRoll} from "@/store/button-change-handle/buttonManageSlice.ts";
import type {RootState} from "@/store";
import { GeneralTriggersV12 } from "@/store/button-sets/ButtonSetV1.2.ts";

type Props = {
    createRoll: (roll: Roll) => void;
};

const defaultRoll: Roll = {
    id: -1,
    name: "New roll",
    trigger: GeneralTriggersV12.OnRoll,
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

const CreateRollDialog = ({createRoll}: Props) => {
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const roll = useSelector((state:RootState) => state.buttonManage.roll);

    useEffect(() => {
        dispatch(setRoll(defaultRoll))
    }, [openDialog]);

    return (<Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <form className={"w-fit"}>
                <DialogTrigger asChild>
                    <Button variant={"outline"} onClick={() => setOpenDialog(true)}>Add Roll</Button>
                </DialogTrigger>
                <RollHandlingDialogContent>
                    <DialogClose>
                        <Button
                            className={"bg-blue-500 hover:bg-blue-600 rounded-lg"}
                            onClick={() => {
                                createRoll(roll);
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