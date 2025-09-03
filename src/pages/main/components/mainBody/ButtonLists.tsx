import type {RootState} from "@/store";
import {useSelector} from "react-redux";
import ButtonListSection from "./ButtonListSection.tsx";

const ButtonLists = () => {
    const buttonSet = useSelector((state: RootState) =>
        state.buttonSet.sets.find((buttonSet) => {
            return buttonSet.id === state.selected.selectedSetId
        }))!

    const tagCounts = buttonSet?.buttonList.reduce((counts, button) => {
        if (button.tag !== undefined && button.tag !== null && button.tag !== -1) {
            counts[button.tag] = (counts[button.tag] || 0) + 1;
        }
        return counts;
    }, {} as Record<number, number>);

    const tags = [...(buttonSet?.tags || [])].sort(
        (a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0)
    );

    return (<div className={"flex flex-col flex-wrap w-fit max-w-2/3 my-2 justify-center items-center"}>
            <ButtonListSection/>
            <div className={"flex flex-row flex-wrap w-fit gap-16 justify-center items-center"}>
                {tags.map((tag) => {
                    return <ButtonListSection tagId={tag.id}/>
                })}
            </div>
        </div>
    );
};

export default ButtonLists;
