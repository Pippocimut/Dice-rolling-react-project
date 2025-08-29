import RollButton from "./RollButton";
import type {ButtonData, Tag} from "@/store/button-sets/buttonSetSlice.ts";

import {SortableList} from "./dnd/SortableList.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";

type Props = {
    selectedTag?: Tag;
    updateButtons: (buttonList: ButtonData[]) => void;
    editMode: boolean;
    items: ButtonData[];
    tagId: number;
};

const ButtonList = ({
                        updateButtons,
                        items,
                        tagId,
                        editMode
                    }: Props) => {

    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(set => set.id === selectedSetId))
    const tag = buttonSet && buttonSet.tags ? buttonSet.tags.find(tag => tag.id === tagId) : undefined;
    const tagName = tag && tag.name ? tag.name : "Other";

    return (
        <div className={"w-full flex flex-col gap-4 my-4"}>
            <div className={"flex flex-row gap-8 justify-between border-b-4 w-full p-2"}>
                <h1 className={"text-4xl font-bold text-left"}>{tagName.charAt(0).toUpperCase() + tagName.slice(1)}</h1>
                <CreateButtonDialog selectedTag={tag}>
                    <Button className={"text-3xl w-10 h-10 "+ (tag? tag.color: "")} >
                        <span className="mb-1">+</span>
                    </Button>
                </CreateButtonDialog>
            </div>
            <SortableList
                items={items}
                onChange={updateButtons}
                renderItem={(buttonData) => {
                    return (
                        <SortableList.Item id={buttonData.id}>
                            <div className={"flex flex-row"} key={buttonData.id}>
                                <RollButton
                                    id={buttonData.id}
                                    editMode={editMode}
                                    rolls={buttonData.rolls}
                                    name={buttonData.name}
                                    color={buttonData.color}
                                    tag={buttonData.tag}
                                    key={buttonData.id}
                                />
                            </div>
                        </SortableList.Item>)}
                }
            />
        </div>
    );
};

export default ButtonList;
