import { Button } from "@/components/ui/button.tsx";
import CreateTriggerDialog from "@/pages/main/components/mainBody/dialogs/forms/RollForms/CreateTriggerDialog";
import TriggerList from "@/pages/main/components/mainBody/dialogs/forms/TriggersList";
import { selectCurrentButton, upsertButtonOfSet, type RollTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Separator } from "@/components/ui/separator";

export function RollSelection() {
    const button = useSelector(selectCurrentButton)!
    const dispatch = useDispatch();

    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const handleCreateTrigger = (trigger: Trigger) => {
        console.log("I'm creating a trigger with these values", trigger)
        console.log("Inside this button", button)
        const newButton = {
            ...button,
            triggers: {
                ...button.triggers,
                [trigger.id]: {
                    ...button.triggers[trigger.id],
                    isNotComplete: false
                } as RollTrigger
            }
        }
        console.log("New button", newButton)
        dispatch(upsertButtonOfSet({
            button: newButton, setId: selectedSetId
        }))
    }

    const handleClearTriggers = () => {
        dispatch(upsertButtonOfSet({
            button: {
                ...button,
                triggers: {}, nextTriggerId: 1
            }, setId: selectedSetId
        }))
    }

    return <div
        className={"flex flex-col justify-center w-full items-center rounded-md border-neutral-200 border-1 shadow-sm p-4 gap-4"}>
        <div className={"flex flex-row gap-2 justify-between w-full items-center"}>
            <CreateTriggerDialog createRoll={handleCreateTrigger} />

            {(Object.values(button.triggers).filter(trigger => !trigger.isNotComplete).length > 0) && (
                <Button variant={"outline"} onClick={handleClearTriggers}>
                    Clear rolls
                </Button>
            )}
        </div>
        <Separator />

        {(Object.values(button.triggers).length > 0) && <TriggerList />}
    </div>
}