import type {RootState} from "../../../../store";
import {useSelector} from "react-redux";
import type {ButtonData, Tag} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useMemo} from "react";
import ButtonListSection from "./ButtonListSection.tsx";

type Props = {
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    updateButtons: (buttonList: ButtonData[]) => void;
    editButton: (index: number) => void;
    openCreateDialog: () => void;
    editMode: boolean;
};

const ButtonList = ({
                        removeButton,
                        editButton,
                        updateButtons,
                        openCreateDialog,
                        editMode
                    }: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) => {
            console.log("Button set id:", buttonSet.id)
            console.log("Selected set id:", selectedSetId)
            return buttonSet.id === selectedSetId
        });
    }, [buttonSets, selectedSetId]);

    const tags = buttonSet?.tags ?? []

    const untaggedButtons = buttonSet?.buttonList.filter(button => button.tag === undefined || button.tag === -1 || button.tag === null)

    return (
        <div className={"flex flex-row flex-wrap mx-8 gap-8 justify-center items-center"}>
            {tags.length > 0 && <>
                {tags.map((tag) => {
                    const items = buttonSet?.buttonList.filter(button => button.tag === tag.id)

                    if (items && items.length > 0) {
                        return <ButtonListSection removeButton={removeButton} updateButtons={updateButtons}
                                                  editButton={editButton} openCreateDialog={openCreateDialog}
                                                  editMode={editMode} items={items} tagName={tag.name}/>

                    }

                })}

            </>}
            {untaggedButtons && untaggedButtons.length > 0 &&
                <ButtonListSection removeButton={removeButton} updateButtons={updateButtons}
                                   editButton={editButton} openCreateDialog={openCreateDialog}
                                   editMode={editMode} items={untaggedButtons} tagName={"Other"}/>

            }
        </div>
    );
};

export default ButtonList;
