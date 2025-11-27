import {Button} from "@/components/ui/button.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ButtonSortableList} from "./ButtonSortableList.tsx";
import {useMemo} from "react";
import type {Tag} from "@/store/button-sets/buttonSetSlice.ts";
import type {RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {resetButton} from "@/store/button-change-handle/buttonManageSlice.ts";

type Props = {
    tagId: number;
};

function SmallCreateButtonDialog({tag}: { tag: Tag }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onClick = () => {
        dispatch(resetButton({tag}))
        navigate("/button/create")
    }

    return <Button className={"text-3xl w-10 h-10 " + (tag ? tag.color : "")} onClick={onClick}>
            <span className="mb-1">+</span>
        </Button>
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
            <ButtonSortableList items={items.sort((a, b) => a.position - b.position)}/>
        </div>
    );
};

export default ButtonListSection;
