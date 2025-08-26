import {useSelector} from "react-redux";
import type {RootState} from "@/store";

export function Info() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const {roomName} = useSelector((state: RootState) => state.socket)

    return <div className={"text-center flex flex-col w-fit gap-4"}>
        <h1 className={"text-6xl text-center font-bold"}> A dice roller app </h1>
        <h2 className={"text-2xl text-center"}>
            {buttonSets?.find((buttonSet) => buttonSet.id == selectedSetId)?.buttonList?.length === 0 ? "Create a dice roll set by pressing the button" : "Click on a button to roll it"}
        </h2>
        {
            roomName && roomName.length > 0 && <p className={"text-2xl text-center"}>
                Connected to: <span className={"font-bold"}>{roomName}</span>
            </p>
        }
    </div>
}