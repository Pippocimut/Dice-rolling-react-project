import {Button} from "@/components/ui/button.tsx";
import CreateRollDialog from "@/pages/main/components/mainBody/dialogs/forms/RollForms/CreateRollDialog.tsx";
import RollsList from "@/pages/main/components/mainBody/dialogs/forms/RollsList.tsx";
import type {Roll} from "@/store/button-sets/buttonSetSlice";
import {setButton} from "@/store/button-change-handle/buttonManageSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Separator} from "@/components/ui/separator";

export function RollSelection() {
    const button = useSelector((state: RootState) => state.buttonManage.button);
    const dispatch = useDispatch();

    return <div
        className={"flex flex-col justify-center w-full items-center rounded-md border-neutral-200 border-1 shadow-sm p-4 gap-4"}>
        <div className={"flex flex-row gap-2 justify-between w-full items-center"}>
            <CreateRollDialog createRoll={(roll: Roll) => {
                dispatch(setButton({
                    ...button, rolls: {
                        ...button.rolls,
                        [button.nextRollId]: {
                            ...roll,
                            id: button.nextRollId
                        }
                    }, nextRollId: button.nextRollId + 1
                }))
            }}/>

            {(Object.values(button.rolls).length > 0) && (
                <Button variant={"outline"} onClick={() => dispatch(setButton({...button, rolls: []}))}>
                    Clear rolls
                </Button>
            )}
        </div>
        <Separator/>

        {(Object.values(button.rolls).length > 0) && <RollsList/>}
    </div>
}