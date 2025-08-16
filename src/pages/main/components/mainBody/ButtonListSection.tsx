import RollButton from "./RollButton";
import type {ButtonData, Tag} from "../../../../store/button-sets/buttonSetSlice.ts";

import {SortableList} from "./dnd/SortableList.tsx";

type Props = {
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    updateButtons: (buttonList: ButtonData[]) => void;
    editButton: (index: number) => void;
    openCreateDialog: () => void;
    editMode: boolean;
    items: ButtonData[];
    tagName: string;
};

const ButtonList = ({
                        removeButton,
                        editButton,
                        updateButtons,
                        items,
                        tagName,
                        openCreateDialog,
                        editMode
                    }: Props) => {

    return (
        <div className={"w-full"}>
            <h1 className={"text-4xl font-bold text-left p-4  border-b-4 w-full"}>{tagName.charAt(0).toUpperCase() + tagName.slice(1)}</h1>
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
        </div>

    );
};

export default ButtonList;
