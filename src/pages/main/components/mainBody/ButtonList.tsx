import RollButton from "./RollButton";
import type {RootState} from "../../../../store";
import {useSelector} from "react-redux";
import type {ButtonData, Tag} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useMemo} from "react";

import {SortableList} from "./dnd/SortableList.tsx";

type Props = {
    buttonSetName: string;
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    updateButtons: (buttonList: ButtonData[]) => void;
    editButton: (index: number) => void;
    openCreateDialog: () => void;
};

const ButtonList = ({
                        buttonSetName,
                        selectedTag,
                        removeButton,
                        editButton,
                        updateButtons,
                        openCreateDialog,
                    }: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const buttonSet = useMemo(() => {
        return buttonSets.find((buttonSet) => buttonSet.name === buttonSetName) || null;
    }, [buttonSets, buttonSetName]);

    const items = buttonSet?.buttonList.map((buttonData: ButtonData) => {
        if (!selectedTag || buttonData.tag === selectedTag.id) {
            return buttonData
        }
    }).filter(item => item !== undefined) ?? []

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
