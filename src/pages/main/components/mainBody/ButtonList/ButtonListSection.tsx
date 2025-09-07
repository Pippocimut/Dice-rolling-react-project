import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";
import {ButtonSortableList} from "./ButtonSortableList.tsx";
import {useMemo} from "react";
import type {Tag} from "@/store/button-sets/buttonSetSlice.ts";
import type {RootState} from "@/store";

type Props = {
    tagId: number;
};

function SmallCreateButtonDialog({tag}: { tag: Tag }) {
    return <CreateButtonDialog selectedTag={tag}>
        <Button className={"text-3xl w-10 h-10 " + (tag ? tag.color : "")}>
            <span className="mb-1">+</span>
        </Button>
    </CreateButtonDialog>
}

const ButtonListSection = ({tagId = -1}: Props) => {
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets[ state.buttonSet.selectedSetId])!

    const items = useMemo(() => {
        return Object.values(buttonSet.buttonList).filter(button => button.tag === tagId)
    }, [buttonSet, tagId]);

    if (tagId === -1) return null
    if (items.length === 0) return null;

    const tag = buttonSet.tags[tagId]
    const formattedTagName = tag.name.charAt(0).toUpperCase() + tag.name.slice(1)

    return (
        <div className={"w-fit flex flex-col gap-4 my-4"}>
            <div className={"flex flex-row gap-8 justify-between border-b-4 w-full p-2"}>
                <h1 className={"text-4xl font-bold text-left"}>{formattedTagName}</h1>
                <SmallCreateButtonDialog tag={tag}/>
            </div>
            <ButtonSortableList items={items}/>
        </div>
    );
};

export default ButtonListSection;
