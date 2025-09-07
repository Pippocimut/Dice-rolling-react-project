import {useSelector} from "react-redux";
import type {RootState} from "@/store";

export function MainInfo() {
    const {roomName} = useSelector((state: RootState) => state.socket)

    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.selected.selectedSetId])
    const areThereNoButtons = (Object.values(currentSet.buttonList ?? {}).length ?? 0) === 0

    const isConnected = (!!roomName && roomName.length > 0) ?? false

    return <div className={"text-center flex flex-col w-fit gap-4"}>
        <h1 className={"text-6xl text-center font-bold"}> A dice roller app </h1>
        <h2 className={"text-2xl text-center"}>
            {
                areThereNoButtons ?
                    "Create a dice roll set by pressing the button" :
                    "Click on a button to roll it"
            }
        </h2>
        {isConnected && <p className={"text-2xl text-center"}>
            Connected to: <span className={"font-bold"}>{roomName}</span>
        </p>
        }
    </div>
}