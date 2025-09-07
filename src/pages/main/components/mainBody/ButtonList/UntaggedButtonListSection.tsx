import {useSelector} from "react-redux";
import {ButtonSortableList} from "./ButtonSortableList.tsx";
import {useMemo} from "react";
import type {RootState} from "@/store";

const UntaggedButtonListSection = () => {
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets[ state.selected.selectedSetId])!

    const items = useMemo(() => {
        if (!buttonSet) return [];
        return Object.values(buttonSet.buttonList).filter(button => !button.tag || button.tag === -1)
    }, [buttonSet]);

    if (items.length === 0) return null;

    return (
        <div className={"w-fit flex flex-col gap-4 my-4"}>
            <ButtonSortableList items={items}/>
        </div>
    );
};

export default UntaggedButtonListSection;
