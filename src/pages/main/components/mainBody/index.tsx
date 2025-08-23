import {useCallback, useState} from "react";
import ButtonList from "./ButtonList.tsx";
import DefaultDialog from "./dialogs/DefaultDialog.tsx";
import {
    type ButtonData,
    type ButtonSet,
    sendNewButtonList,
    updateButtonSets
} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import EditButtonForm from "./dialogs/forms/ButtonForms/EditButtonForm.tsx";
import CreateButtonForm from "./dialogs/forms/ButtonForms/CreateButtonForm.tsx";
import {toggleEditMode} from "@/store/selected/selectedSlice.ts";
import {BsPencilFill} from "react-icons/bs";
import {Slide, ToastContainer} from "react-toastify";

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

    let moreThanOneButton = false;
    const buttonFound = buttonSets.find((buttonSet) => buttonSet.id === selectedSetId)
    if (buttonFound) {
        moreThanOneButton = buttonFound.buttonList.length > 0;
    }
    const {roomName} = useSelector((state: RootState) => state.socket)

    return (
        <div className={"flex flex-col min-h-full pb-8 px-4 min-w-1/4 gap-4 w-full bg-background items-center"}>
            <ToastContainer position="bottom-left"
                            newestOnTop={false}
                            transition={Slide}
                            stacked/>
            <h1 className={"text-6xl font-bold mx-8 mb-8"}>
                A dice roller app
            </h1>
            <p className={"text-2xl"}>
                {buttonSets?.find((buttonSet) => buttonSet.id == selectedSetId)?.buttonList?.length === 0 ? "Create a dice roll set by pressing the button" : "Click on a button to roll it"}
            </p>
            {roomName && roomName.length > 0 && <p className={"text-2xl"}>
                Connected to: <span className={"font-bold"}>{roomName}</span>
            </p>}

            <div
                className={"flex flex-row-reverse flex-wrap  items-center justify-center w-full m-8 gap-8 " + (moreThanOneButton ? " " : " h-full mb-64")}>
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
            </div>
            <ButtonList
                editMode={editMode}
                selectedTag={selectedTag}
                removeButton={removeButton}
                updateButtons={(newButtonList) => {
                    const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.id === selectedSetId)
                    const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.id === button.id) === undefined
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