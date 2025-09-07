import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";
import {Button} from "@/components/ui/button.tsx";

export function CreateButtonButton() {
    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.selected.selectedSetId])
    const areThereButtons = !((Object.values(currentSet.buttonList ?? {}).length ?? 0) === 0)

    return <CreateButtonDialog>
        <Button
            id="createButton"
            className={
                (areThereButtons ? "w-20 h-20 text-6xl" : "w-40 h-40 text-8xl") +
                " flex items-center flex-row justify-center  bg-primary hover:outline-2 rounded-xl"
            }
        >
            <span className={"text-white pb-3"}>+</span>
        </Button>
    </CreateButtonDialog>
}
