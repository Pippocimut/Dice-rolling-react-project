import {useCallback, useState} from "react";
import ButtonList from "./ButtonList.tsx";
import DefaultDialog from "./dialogs/DefaultDialog.tsx";
import {
    type ButtonData,
    type ButtonSet,
    sendNewButtonList,
    updateButtonSets
} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import EditButtonForm from "./dialogs/forms/EditButtonForm.tsx";
import CreateButtonForm from "./dialogs/forms/CreateButtonForm.tsx";
import {toggleEditMode} from "../../../../store/selected/selectedSlice.ts";
import {BsPencilFill} from "react-icons/bs";
import {FaDiceD20} from "react-icons/fa";

const MainBody = () => {
    const dispatch = useDispatch();

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedTagId = useSelector((state: RootState) => state.selected.selectedTagId)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

    const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);

    const removeButton = useCallback(
        (index: number,) => {
            const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.id === selectedSetId)
            const newButtonList = buttonSets[indexOfButtonSet].buttonList.filter((_: object, i: number) => i !== index)
            dispatch(updateButtonSets(newButtonList));
            setIsOpenEditDialog(false);
            setSelectedButtonId(null);
        },
        [buttonSets]
    );

    const editButton = useCallback((index: number) => {
        setSelectedButtonId(index);
        setIsOpenEditDialog(true);
    }, []);

    const editMode = useSelector((state: RootState) => state.selected.editMode)
    const selectedTag = buttonSets.find((buttonSet) => buttonSet.id == selectedSetId)?.tags.find((tag) => tag.id == selectedTagId)

    console.log(buttonSets.find((buttonSet) => buttonSet.id == selectedSetId))

    let moreThanOneButton = false;
    const buttonFound = buttonSets.find((buttonSet) => buttonSet.id === selectedSetId)
    if (buttonFound) {
        moreThanOneButton = buttonFound.buttonList.length > 0;
    }

    return (
        <div
            className={
                "flex flex-col min-h-screen gap-4 w-full bg-neutral-900 items-center"
            }
        >
            <h1 className={"text-6xl font-bold m-8"}>
                A dice roller app
            </h1>
            <p className={"text-2xl"}>
                {buttonSets?.find((buttonSet) => buttonSet.id == selectedSetId)?.buttonList?.length === 0 ? "Create a dice roll set by pressing the button" : "Click on a button to roll it"}
            </p>

            <div className={"flex flex-row items-center justify-center w-full mt-8 gap-16 "}>
                <button
                    id="createButton"
                    className={
                        "w-45 h-30 flex items-center flex-row justify-center bg-neutral-700 hover:outline-2 rounded-lg"
                    }
                    onClick={() => setIsOpenCreateDialog(true)}
                >
                    <span className={"text-6xl flex flex-row"}>+<FaDiceD20/></span>
                </button>
                {moreThanOneButton && <button
                    id="editModeButton"
                    className={"w-40 h-20 rounded-lg hover:outline-2 text-lg " + (editMode ? " bg-white border-4 border-neutral-700 text-neutral-700" : " bg-neutral-700 text-white")}
                    onClick={() => dispatch(toggleEditMode())}>{
                    editMode ? <span className={"text-lg"}>Done</span> : <div
                        className={"flex justify-center gap-2 items-center"}
                    ><BsPencilFill/> <span className={"pr-4 text-lg"}>Edit</span></div>
                }</button>}
            </div>
            <ButtonList
                editMode={editMode}
                selectedTag={selectedTag}
                removeButton={removeButton}
                updateButtons={(newButtonList) => {
                    const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.id === selectedSetId)
                    const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.name === button.name) === undefined
                    const updatedButtonList = buttonSets[indexOfButtonSet].buttonList.filter(filter)
                    dispatch(sendNewButtonList({
                        setId: selectedSetId,
                        buttons: [...updatedButtonList, ...newButtonList]
                    }));
                }}
                editButton={editButton}
                openCreateDialog={() => setIsOpenCreateDialog(true)}
            />

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

            <DefaultDialog
                isOpen={isOpenEditDialog}
                onClose={() => {
                    setIsOpenEditDialog(false);
                }}
            >
                {selectedButtonId !== null && selectedButtonId !== -1 && (
                    <EditButtonForm
                        close={() => {
                            setSelectedButtonId(-1)
                            setIsOpenEditDialog(false)
                        }}
                        selectedButtonId={selectedButtonId}
                    />
                )}
            </DefaultDialog>
        </div>
    );
};

export default MainBody;