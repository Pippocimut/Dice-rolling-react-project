import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonDialog} from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/CreateButtonDialog.tsx";
import {ButtonList} from "./ButtonList";

type Props = {
    tagId?: number;
};

const ButtonListSection = ({tagId = -1}: Props) => {
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(set => set.id === selectedSetId))!

    const items = (tagId === -1) ?
        buttonSet.buttonList.filter(button => !button.tag || button.tag === -1) :
        buttonSet.buttonList.filter(button => button.tag === tagId)

    const tag = buttonSet && buttonSet.tags ? buttonSet.tags.find(tag => tag.id === tagId) : undefined;
    const tagName = tag && tag.name ? tag.name : "Other";

    if (!buttonSet) return null;
    if (items.length === 0) return null;

    const sectionName = tagName.charAt(0).toUpperCase() + tagName.slice(1)

    return (
        <div className={"w-full flex flex-col gap-4 my-4"}>
            <div className={"flex flex-row gap-8 justify-between border-b-4 w-full p-2"}>
                <h1 className={"text-4xl font-bold text-left"}>{sectionName}</h1>
                <CreateButtonDialog selectedTag={tag}>
                    <Button className={"text-3xl w-10 h-10 " + (tag ? tag.color : "")}>
                        <span className="mb-1">+</span>
                    </Button>
                </CreateButtonDialog>
            </div>
            <ButtonList items={items}/>
        </div>
    );
};

export default ButtonListSection;
