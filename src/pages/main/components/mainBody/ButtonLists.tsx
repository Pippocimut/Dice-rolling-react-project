import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {
    type ButtonData,
    type ButtonSet, sendNewButtonList,
    updateButtonSets
} from "@/store/button-sets/buttonSetSlice.ts";
import {useCallback, useMemo, useState} from "react";
import ButtonListSection from "./ButtonListSection.tsx";
import EditButtonForm from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/EditButtonForm.tsx";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";

const ButtonLists = () => {

    const dispatch = useDispatch();

    const editMode = useSelector((state: RootState) => state.selected.editMode)
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [selectedButtonId, setSelectedButtonId] = useState<number | null>(null);

    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) => {
            console.log("Button set id:", buttonSet.id)
            console.log("Selected set id:", selectedSetId)
            return buttonSet.id === selectedSetId
        });
    }, [buttonSets, selectedSetId]);

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

    const updateButtons = useCallback((newButtonList: ButtonData[]) => {
            const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.id === selectedSetId)
            const filter = (button: ButtonData) => newButtonList.find((newButton) => newButton.id === button.id) === undefined
            const updatedButtonList = buttonSets[indexOfButtonSet].buttonList.filter(filter)
            dispatch(sendNewButtonList({
                setId: selectedSetId,
                buttons: [...updatedButtonList, ...newButtonList]
            }));
        }
        , [])

    const tags = buttonSet?.tags ?? []

    const untaggedButtons = buttonSet?.buttonList.filter(button => button.tag === undefined || button.tag === -1 || button.tag === null)

    return (
        <div className={"flex flex-row w-fit mx-8 flex-wrap gap-8 justify-center items-center"}>
            {tags.length > 0 && <>
                {tags.map((tag) => {
                    const items = buttonSet?.buttonList.filter(button => button.tag === tag.id)

                    if (items) {
                        return <ButtonListSection removeButton={removeButton} updateButtons={updateButtons}
                                                  editButton={editButton}
                                                  editMode={editMode} items={items} tagId={tag.id}/>

                    }

                })}

            </>}
            {untaggedButtons && untaggedButtons.length > 0 &&
                <ButtonListSection removeButton={removeButton} updateButtons={updateButtons}
                                   editButton={editButton}
                                   editMode={editMode} items={untaggedButtons} tagId={-1}/>

            }
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

export default ButtonLists;
