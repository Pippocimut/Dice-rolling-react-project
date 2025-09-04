import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";
import {ButtonSortableList} from "./ButtonSortableList.tsx";
import {useMemo} from "react";
import type {Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {getSelectedSet} from "@/pages/main/components/mainBody/utils.ts";

type Props = {
    tagId?: number;
};

function SmallCreateButtonDialog({tag}: { tag: Tag }) {
    return <CreateButtonDialog selectedTag={tag}>
        <Button className={"text-3xl w-10 h-10 " + (tag ? tag.color : "")}>
            <span className="mb-1">+</span>
        </Button>
    </CreateButtonDialog>
}

const ButtonListSection = ({tagId = -1}: Props) => {
    const buttonSet = useSelector(getSelectedSet)!

    const items = useMemo(() => {
        if (!buttonSet) return [];
        return (tagId === -1) ?
            buttonSet.buttonList.filter(button => !button.tag || button.tag === -1) :
            buttonSet.buttonList.filter(button => button.tag === tagId)
    }, [buttonSet, tagId]);

    if (items.length === 0) return null;

    const tag = buttonSet.tags.find(tag => tag.id === tagId)
    const tagName = tag?.name ?? "Other";
    const formattedTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1)

    return (
        <div className={"w-fit flex flex-col gap-4 my-4"}>
            {!!tag && <div className={"flex flex-row gap-8 justify-between border-b-4 w-full p-2"}>
                <h1 className={"text-4xl font-bold text-left"}>{formattedTagName}</h1>
                <SmallCreateButtonDialog tag={tag}/>
            </div>}
            <ButtonSortableList items={items}/>
        </div>
    );
};

export default ButtonListSection;
