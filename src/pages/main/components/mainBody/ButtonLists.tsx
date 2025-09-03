import type {RootState} from "@/store";
import {useSelector} from "react-redux";
import ButtonListSection from "./ButtonListSection.tsx";

const ButtonLists = () => {
    const buttonSet = useSelector((state: RootState) =>
        state.buttonSet.sets.find((buttonSet) => {
            return buttonSet.id === state.selected.selectedSetId
        }))!

    const tags = buttonSet.tags ?? []
    const untaggedButtons = buttonSet.buttonList.filter(button => button.tag === undefined || button.tag === -1 || button.tag === null) ?? []

    return (<div className={"flex flex-col w-fit max-w-2/3 flex-wrap gap-8 justify-center items-center"}>
            {tags.map((tag) => {
                return <ButtonListSection tagId={tag.id}/>
            })}
            {untaggedButtons.length > 0 && <ButtonListSection/>}
        </div>
    );
};

export default ButtonLists;
