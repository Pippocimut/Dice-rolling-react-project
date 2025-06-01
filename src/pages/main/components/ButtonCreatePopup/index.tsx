import {RollInput} from "../RollInput";
import type {Roll} from "../../types.ts";
import {useState} from "react";
import {useCookies} from "react-cookie";
import {CreateButtonDialog} from "../CreateButtonDialog.tsx";
import {toast} from "react-toastify";

export function ButtonCreatePopup({buttonList, onClose}: {
    buttonList: { name: string, rolls: Roll[] }[],
    onClose: () => void
}) {
    const [name, setName] = useState("")
    const [rolls, setRolls] = useState<Roll[]>([])

    const {1: setCookie} = useCookies(["buttonList"])
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const createNewButton = () => {
        if (name == "") {
            toast.error("Button name cannot be empty")
            return
        }
        const newButton = {
            name: name,
            rolls: rolls,
        }
        setCookie("buttonList", [...buttonList, newButton])
        setRolls([])
        onClose()
    }

    return (
        <div
            className={"flex flex-col gap-2 m-4 p-4 w-fit justify-center items-center h-fit"}>

            <input
                className={"p-4 m-4 w-50 border-2 border-gray-500 rounded-lg w-full text-left"}
                type={"text"} placeholder={"Button's Name"} value={name} onChange={(e) => setName(e.target.value)}/>
            <div className={"flex flex-row gap-2"}>
                <button className={"p-6 m-4"} onClick={() => setRolls([])}>Clear rolls</button>
                <button className={"p-6 m-4"} onClick={() => setIsOpenDialog(true)}>Add roll</button>
            </div>
            <div className={"flex flex-row gap-2 w-full"}>
                {rolls.map((roll, index) => (
                    <div
                        className={"flex flex-row gap-2 w-full justify-center items-center border-2 border-gray-500 rounded-lg shadow-lg"}>
                        <button className={"m-4"}> {roll.name} </button>
                        <button className={"m-4"}
                                onClick={() => setRolls((prevRolls) => prevRolls.filter((_, i) => i !== index))}> Delete
                            roll
                        </button>
                    </div>))}
            </div>
            <div className="p-4 flex flex-row gap-2 w-full justify-center items-center">
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={createNewButton}>
                    Create Button
                </button>
            </div>
            <CreateButtonDialog isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
                <RollInput createRoll={(roll: Roll) => {
                    setRolls((prev) => [...prev, roll])
                    setIsOpenDialog(false)
                }}/>
            </CreateButtonDialog>
        </div>
    )
}
