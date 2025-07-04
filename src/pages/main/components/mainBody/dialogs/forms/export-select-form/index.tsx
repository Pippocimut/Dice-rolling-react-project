import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../../store";
import {toast} from "react-toastify";
import useCheckboxSelection from "./useCheckboxSelection.tsx";
import {SetList} from "./SetList.tsx";

type Props = {
    close: () => void,
    exportData: (tags: string[], buttons: string[], setName: string) => void,
}

export default function Index({close, exportData}: Props) {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const [setName, setSetName] = useState("")

    const {
        checkedData,
        onSelectAllChange,
        clearAll
    } = useCheckboxSelection();

    useEffect(() => {
        clearAll();
    }, []);

    const onExportClick = () => {
        if (setName === "") {
            toast.error("Set name is required")
            return;
        }

        const allTags = Object.entries(checkedData.tags).reduce((acc: string[], {1: value}) => {
            acc.push(...value)
            return acc
        }, [])

        const allButtons = Object.entries(checkedData.buttons).reduce((acc: string[], {1: value}) => {
            acc.push(...value)
            return acc
        }, [])

        exportData(allTags, allButtons, setName);
        clearAll();
        close()
    }

    const noButtonsToDisplay = buttonSets.filter((buttonSet) => buttonSet.buttonList.length > 0).length === 0;

    return <div className={"flex flex-col w-full h-full"}>
        <h1 className={"text-4xl font-bold mx-auto text-center my-2"}>
            Export
        </h1>
        {noButtonsToDisplay && <h2 className={"text-xl font-bold mx-auto text-center my-4 p-4"}>
            No buttons to display, create some buttons
        </h2>}
        {!(noButtonsToDisplay) && <>
            <input type="text" className={"w-fit text-2xl p-2 my-4 mx-auto border-2 border-gray-300 rounded-2xl"}
                   placeholder={"Set name"} onChange={(e) => {
                setSetName(e.target.value)
            }} value={setName}/>
            <div className={"flex flex-row justify-between px-2 mx-2"}>
                <button onClick={onSelectAllChange}> Select all</button>
                <button onClick={clearAll}> Clear all</button>
            </div>
            <SetList/>
            <button className={"w-full mt-4"} onClick={onExportClick}>
                Export
            </button>
        </>}
    </div>
}