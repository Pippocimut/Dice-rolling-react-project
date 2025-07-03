import {useState} from "react";
import TagsSideBar from "./components/sidebars/TagsSidebar.tsx";
import MainBody from "./components/mainBody/index.tsx";
import HistorySideBar from "./components/sidebars/HistorySidebar.tsx";
import type {Tag} from "../../store/buttonSets/buttonSetSlice.ts";

export function Main() {
    const [selectedTag, setSelectedTag] = useState<Tag>();
    const [selectedSet, setSelectedSet] = useState<string>("Default");

    return (
        <div className={"flex flex-row h-screen w-full justify-start items-start"}>
            <TagsSideBar selectedTag={selectedTag} setSelectedTag={setSelectedTag}
                         selectedButtonSet={selectedSet}
                         setSelectButtonSet={(set: string | undefined) => {
                             setSelectedSet(set)
                         }}/>
            <MainBody selectedTag={selectedTag} selectedSet={selectedSet}/>
            <HistorySideBar/>
        </div>
    );
}
