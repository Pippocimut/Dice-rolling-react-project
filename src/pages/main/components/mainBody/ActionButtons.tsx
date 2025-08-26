import {toggleEditMode} from "@/store/selected/selectedSlice.ts";
import {BsPencilFill} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useState} from "react";
import CreateButtonForm from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonForm.tsx";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";

export function ActionButtons() {

    const dispatch = useDispatch();
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedTagId = useSelector((state: RootState) => state.selected.selectedTagId)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

    const editMode = useSelector((state: RootState) => state.selected.editMode)
    const selectedTag = buttonSets.find((buttonSet) => buttonSet.id == selectedSetId)?.tags.find((tag) => tag.id == selectedTagId)

    let moreThanOneButton = false;
    const buttonFound = buttonSets.find((buttonSet) => buttonSet.id === selectedSetId)
    if (buttonFound) {
        moreThanOneButton = buttonFound.buttonList.length > 0;
    }

    return <div
        id={"action-buttons"}
        className={"flex flex-row-reverse flex-wrap items-center justify-center w-fit gap-8 " + (moreThanOneButton ? " " : " h-full mb-64")}>
        <button
            id="createButton"
            className={
                (moreThanOneButton ? "w-20 h-20 text-6xl" : "w-40 h-40 text-8xl") +
                " flex items-center flex-row justify-center  bg-primary hover:outline-2 rounded-xl"
            }
            onClick={() => setIsOpenCreateDialog(true)}
        >
            <span className={"text-white pb-3"}>+</span>
        </button>

        {moreThanOneButton && <button
            id="editModeButton"
            className={"w-20 h-20 rounded-xl hover:outline-2 text-2xl " + (editMode ? " bg-white border-4 border-primary text-primary" : " bg-primary text-white")}
            onClick={() => dispatch(toggleEditMode())}>{
            editMode ? <span className={"text-5xl pb-2 font-bold"}>&#10004;</span> : <div
                className={"flex justify-center gap-2 items-center"}
            ><BsPencilFill/></div>
        }</button>}

        <DefaultDialog
            isOpen={isOpenCreateDialog}
            onClose={() => {
                setIsOpenCreateDialog(false);
            }}
        >
            <CreateButtonForm
                close={() => setIsOpenCreateDialog(false)}
                selectedTag={selectedTag}
            />
        </DefaultDialog>
    </div>

}