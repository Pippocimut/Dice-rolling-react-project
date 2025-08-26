import RollButton from "./RollButton";
import type {ButtonData, Tag} from "@/store/button-sets/buttonSetSlice.ts";

import {SortableList} from "./dnd/SortableList.tsx";
import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";
import CreateButtonForm from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonForm.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useState} from "react";

type Props = {
    selectedTag?: Tag;
    removeButton: (index: number) => void;
    updateButtons: (buttonList: ButtonData[]) => void;
    editButton: (index: number) => void;
    editMode: boolean;
    items: ButtonData[];
    tagId: number;
};

const ButtonList = ({
                        removeButton,
                        editButton,
                        updateButtons,
                        items,
                        tagId,
                        editMode
                    }: Props) => {

    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(set => set.id === selectedSetId))
    const tag = buttonSet && buttonSet.tags ? buttonSet.tags.find(tag => tag.id === tagId) ?? null : null;
    const tagName = tag && tag.name ? tag.name : "Other";

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

    return (
        <div className={"w-full flex flex-col gap-4 my-4"}>
            <div className={"flex flex-row gap-8 justify-between border-b-4 w-full p-2"}>
                <h1 className={"text-4xl font-bold text-left"}>{tagName.charAt(0).toUpperCase() + tagName.slice(1)}</h1>
                <Button className={"text-3xl w-10 h-10 "+ (tag? tag.color: "")} onClick={() => setIsOpenCreateDialog(true)}>
                    <span className="mb-1">+</span>
                </Button>
            </div>
            <SortableList
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
            <DefaultDialog
                isOpen={isOpenCreateDialog}
                onClose={() => {
                    setIsOpenCreateDialog(false);
                }}
            >
                <CreateButtonForm
                    close={() => setIsOpenCreateDialog(false)}
                    selectedTag={tag ?? undefined}
                />
            </DefaultDialog>
        </div>

    );
};

export default ButtonList;
