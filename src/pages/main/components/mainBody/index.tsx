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

    const [editMode, setEditMode] = useState(false)

    const selectedTag = buttonSets.find((buttonSet) => buttonSet.id == selectedSetId)?.tags.find((tag) => tag.id == selectedTagId)

    return (
        <div
            className={
                "flex flex-col min-h-screen gap-4 w-full items-center"
            }
        >
            <button
                className={"p-4 m-16 mr-auto text-white rounded-lg " + (editMode ? "bg-red-500" : "bg-green-500")}
                onClick={() => setEditMode((curr) => !curr)}>{
                editMode ? "Disable Edit Mode" : "Enable Edit Mode"
            }</button>

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