import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";
import {Button} from "@/components/ui/button.tsx";

export function CreateButtonButton() {
    const areThereButtons = useSelector((state: RootState) =>
        !(Object.values(state.buttonSet.sets[state.buttonSet.selectedSetId].buttonList).length === 0)
    )

    const bigButtonClass = "w-40 h-40 text-8xl"
    const smallButtonClass = "w-20 h-20 text-6xl"

    const buttonClass = areThereButtons ? smallButtonClass : bigButtonClass

    return <CreateButtonDialog>
        <Button
            id="createButton"
            className={buttonClass}>
            <span className={"text-white pb-3"}>+</span>
        </Button>
    </CreateButtonDialog>
}
