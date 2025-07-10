import {useCallback, useState} from "react";
import ButtonList from "./ButtonList.tsx";
import CreateButtonForm from "./dialogs/forms/ButtonForm.tsx";
import DefaultDialog from "./dialogs/DefaultDialog.tsx";
import {
    type ButtonData,
    type ButtonSet, sendNewButtonList,
    updateButtonSets
} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";

const MainBody = () => {
    const dispatch = useDispatch();

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedTag = useSelector((state: RootState) => state.selected.selectedTag)
    const selectedSet = useSelector((state: RootState) => state.selected.selectedSet)

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

    const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);


    const removeButton = useCallback(
        (index: number,) => {
            const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.name === selectedSet)
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

    return (
        <div
            className={
                "flex flex-col min-h-screen gap-20 w-full items-center justify-around"
            }
        >
            <ButtonList
                buttonSetName={selectedSet || "Default"}
                selectedTag={selectedTag}
                removeButton={removeButton}
                updateButtons={(newButtonList) => {
                    const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.name === selectedSet)
                    const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.name === button.name) === undefined
                    const updatedButtonList = buttonSets[indexOfButtonSet].buttonList.filter(filter)
                    dispatch(sendNewButtonList({
                        setName: selectedSet,
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
                    mode={"create"}
                    close={() => setIsOpenCreateDialog(false)}
                    selectedTag={selectedTag}
                    selectedSetName={selectedSet!}
                />
            </DefaultDialog>

            <DefaultDialog
                isOpen={isOpenEditDialog}
                onClose={() => {
                    setIsOpenEditDialog(false);
                }}
            >
                {selectedButtonId !== null && (
                    <CreateButtonForm
                        mode={"edit"}
                        close={() => {
                            setSelectedButtonId(-1)
                            setIsOpenEditDialog(false)
                        }}
                        selectedButtonId={selectedButtonId}
                        selectedSetName={selectedSet!}
                    />
                )}
            </DefaultDialog>
        </div>
    );
};

export default MainBody;