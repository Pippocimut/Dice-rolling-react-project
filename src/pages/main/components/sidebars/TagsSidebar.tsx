import Sidebar from "./Sidebar.tsx";
import {type Tag, updateButtonSets} from "../../../../store/buttonSets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../store";

type Props = {
    selectedTag?: Tag;
    selectedButtonSet?: string;
    setSelectedTag: (tag: Tag | undefined) => void;
    setSelectButtonSet: (buttonSet: string | undefined) => void;
};

const TagsSideBar = (props: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const currentSet = buttonSets.find((buttonSet) => buttonSet.name == props.selectedButtonSet)
    const tagList = currentSet?.tags || []

    return (
        <Sidebar direction="left">
            <select className={"w-full"} onChange={(e) => {
                props.setSelectButtonSet(e.target.value)
            }}>
                {buttonSets.map((buttonSet, index) => {
                    return <option
                        { ...(buttonSet.name == props.selectedButtonSet ? {selected: true} : {}) }
                        key={index}>{buttonSet.name}</option>
                })}

            </select>
            <ul
                className={`flex-1 px-3 w-full my-6 block  transition-all h-[100hv-50px] overflow-y-auto`}
            >
                {tagList.map((tag, index: number) => {
                    if (tag.name !== "") {
                        return (
                            <button
                                className={
                                    "w-full rounded-lg my-1 p-4 " +
                                    tag.color +
                                    " " +
                                    (props.selectedTag?.name == tag.name
                                        ? " outline-4"
                                        : " outline-none")
                                }
                                onClick={() => {
                                    if (props.selectedTag && props.selectedTag.name == tag.name) {
                                        props.setSelectedTag(undefined);
                                    } else {
                                        props.setSelectedTag(tag);
                                    }
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    if (currentSet) {
                                        if (currentSet.tags.length <= 1) {
                                            props.setSelectedTag(undefined);
                                        }

                                        buttonSets[buttonSets.findIndex(
                                            (buttonSet) => buttonSet.name == props.selectedButtonSet
                                        )].tags = currentSet.tags.filter((tagI) => tagI.name != tag.name)

                                        updateButtonSets(buttonSets)
                                    }
                                }}
                                key={index}
                            >
                                {tag.name}
                            </button>
                        );
                    }
                    return null;
                })}
            </ul>
        </Sidebar>
    );
};

export default TagsSideBar;
