import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {deleteTagOfSet} from "../../../../store/button-sets/buttonSetSlice.ts";
import {setSelectedTag} from "../../../../store/selected/selectedSlice.ts";
import {useEffect, useRef, useState} from "react";
import {Settings} from "./components/Settings.tsx";
import {Connect} from "./components/Connect.tsx";
import DefaultDialog from "../mainBody/dialogs/DefaultDialog.tsx";
import {SetSelect} from "./components/SetSelect.tsx";

const TagsSideBar = () => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const selectedTagId = useSelector((state: RootState) => state.selected.selectedTagId)
    const selectedButtonSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const dispatch = useDispatch()

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
                " min-h-screen bg-neutral-700 border-r" +
                ` transition-all ${expanded ? "w-150" : "w-15"}`
            }
        >
            <nav
                className={
                    "flex-1 flex-col h-full w-full"
                }>
                <div
                    className={
                        "p-4 pb-2 flex justify-end"
                    }
                >
                    <button
                        onClick={() => setExpanded((curr) => !curr)}
                        className={"focus:outline-none p-0"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={
                                "icon icon-tabler icons-tabler-outline icon-tabler-menu-2"
                            }
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
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
                <div className={"px-3 w-full " + (expanded ? "block" : "hidden")}>
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

                </div>
            </nav>
        </div>
    );
};

export default TagsSideBar;
