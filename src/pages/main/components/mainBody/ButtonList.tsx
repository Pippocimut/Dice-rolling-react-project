import RollButton from "./RollButton";
import type {RootState} from "../../../../store";
import {useSelector} from "react-redux";
import type {ButtonData, Tag} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useMemo} from "react";

import {SortableList} from "./dnd/SortableList.tsx";

type Props = {
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    updateButtons: (buttonList: ButtonData[]) => void;
    editButton: (index: number) => void;
    openCreateDialog: () => void;
    editMode: boolean;
};

const ButtonList = ({
                        selectedTag,
                        removeButton,
                        editButton,
                        updateButtons,
                        openCreateDialog,
                        editMode
                    }: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) =>{
            console.log("Button set id:",buttonSet.id)
            console.log("Selected set id:",selectedSetId)
            return buttonSet.id === selectedSetId
        } );
    }, [buttonSets, selectedSetId]);

    const items = buttonSet?.buttonList.map((buttonData: ButtonData) => {
        if (!selectedTag || buttonData.tag === selectedTag.id) {
            return buttonData
        }
    }).filter(item => item !== undefined) ?? []

    console.log("Items:",items)
    console.log("Button sets:",buttonSets)
    console.log("Button set:",buttonSet)
    console.log("Selected Set Id:",selectedSetId)
    console.log("Selected Tag:",selectedTag)

    return (
        <SortableList
            openCreateDialog={openCreateDialog}
            items={items}
            onChange={updateButtons}
            renderItem={(buttonData) => {
                return (
                    <SortableList.Item id={buttonData.id}>
                        <div className={"flex flex-row"} key={buttonData.id}>
                            <RollButton
                                editMode={editMode}
                                rolls={buttonData.rolls}
                                name={buttonData.name}
                                deleteButton={() => removeButton(buttonData.id)}
                                editButton={() => editButton(buttonData.id)}
                                color={buttonData.color}
                                tag={buttonData.tag}
                                key={buttonData.id}
                            />
                        </div>
                    </SortableList.Item>)
            }
            }
        />
    );
};

export default ButtonList;
