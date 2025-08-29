import CreateButtonForm from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonForm.tsx";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";

export function CreateButtonButton() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

    const areThereButtons = !((buttonSets?.find((buttonSet) => buttonSet.id == selectedSetId)?.buttonList?.length ?? 0) === 0)

    return (<>
        <button
            id="createButton"
            className={
                (areThereButtons ? "w-20 h-20 text-6xl" : "w-40 h-40 text-8xl") +
                " flex items-center flex-row justify-center  bg-primary hover:outline-2 rounded-xl"
            }
            onClick={() => setIsOpenCreateDialog(true)}
        >
            <span className={"text-white pb-3"}>+</span>
        </button>
        <DefaultDialog
            isOpen={isOpenCreateDialog}
            onClose={() => {
                setIsOpenCreateDialog(false);
            }}
        >
            <CreateButtonForm close={() => setIsOpenCreateDialog(false)}/>
        </DefaultDialog>
    </>)
}
