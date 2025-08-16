import { useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {useEffect, useRef, useState} from "react";
import {Settings} from "./components/Settings.tsx";
import {Connect} from "./components/Connect.tsx";
import DefaultDialog from "../mainBody/dialogs/DefaultDialog.tsx";
import {SetSelect} from "./components/SetSelect.tsx";
import HistoryPanel from "./RollHistoryPanel.tsx";

const TagsSideBar = () => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const selectedButtonSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const currentSet = buttonSets.find((buttonSet) => buttonSet.id == selectedButtonSetId)
    const tagList = currentSet?.tags || []

    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

    const [expanded, setExpanded] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [tagList, currentSet, expanded]);

    return (
        <div
            className={
                ` fixed top-0 left-0 z-50 min-w-25 transition-all overflow-hidden transform duration-200 bg-[var(--background-color)]  ease-in-out py-4 text-[var(--text-color)]` +
                ` ${expanded 
                    ? "w-1/3 px-4 max-w-100 min-w-65 h-screen max-h-screen border-r-4 border-[var(--secondary-background-color)] "
                    : "w-1/12 max-w-48 h-25"
                }
`}
        >
            <nav
                className={
                    "flex-1 flex-col h-full w-full"
                }>
                <div
                    className={
                        "w-full pb-2 flex justify-end"
                    }
                >
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className={"focus:outline-none p-4"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={
                                "" +
                                "icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
                            }
                        >
                            <path d="M4 6l16 0"/>
                            <path d="M4 12l16 0"/>
                            <path d="M4 18l16 0"/>
                        </svg>
                    </button>
                </div>
                <button onClick={() => setIsSettingsDialogOpen(true)} className={`w-40 mx-auto rounded-lg m-4 border-2 border-white hover:bg-blue-500 p-4 ${expanded ? "block" : "hidden"}`}>
                    Settings
                </button>
                <SetSelect className={`${expanded ? "block" : "hidden"}`}/>
                <DefaultDialog
                    isOpen={isSettingsDialogOpen}
                    onClose={() => {
                        setIsSettingsDialogOpen(false);
                    }}
                >
                    <div>
                        <Settings/>
                        <Connect/>
                    </div>
                </DefaultDialog>
                <div className={"flex-1 w-full h-full " + (expanded ? "block" : "hidden")}>
                    <HistoryPanel/>
                </div>
               {/* <div className={"px-3 w-full " + (expanded ? "block" : "hidden")}>
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
                                            (selectedTagId == tag.id
                                                ? " outline-4"
                                                : " outline-none")
                                        }
                                        onClick={() => {
                                            if (selectedTagId && selectedTagId == tag.id) {
                                                dispatch(setSelectedTag(undefined));
                                            } else {
                                                dispatch(setSelectedTag(tag.id));
                                            }
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            if (currentSet) {
                                                if (currentSet.tags.length <= 1) {
                                                    dispatch(setSelectedTag(undefined));
                                                }
                                                console.log(currentSet.tags)
                                                console.log(tag.name)
                                                console.log(tag.id)

                                                dispatch(deleteTagOfSet({
                                                    setId: selectedButtonSetId,
                                                    tagId: tag.id
                                                }))
                                            }
                                        }}
                                        key={index}>
                                        {tag.name}
                                    </button>
                                );
                            }
                            return null;
                        })}
                    </ul>

                </div>*/}
            </nav>
        </div>
    );
};

export default TagsSideBar;
