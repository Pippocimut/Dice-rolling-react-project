import {RollButton} from "./components/RollButton";
import {useCookies} from "react-cookie";
import {useState} from "react";
import type {Roll} from "./types.ts";
import {RollInput} from "./components/RollInput/index.tsx";

export function Main() {
    const [cookie, setCookie, removeCookie] = useCookies(["buttonList"])
    const [rolls, setRolls] = useState<Roll[]>([])
    const [name, setName] = useState("")

    const buttonList = cookie.buttonList || []

    const createNewButton = () => {
        const newButton = {
            name: name,
            rolls: rolls,
        }
        setCookie("buttonList", [...buttonList, newButton])
        setRolls([])
    }

    const removeButton = (index: number) => {
        const newButtonList = [...buttonList]
        newButtonList.splice(index, 1)
        setCookie("buttonList", newButtonList)
    }


    return (<div className={"flex flex-col h-full gap-20 items-center justify-around"}>
        <div
            className={"flex flex-col gap-2 m-4 p-4 border-2 border-gray-500 rounded-lg shadow-lg w-fit justify-center items-center h-fit"}>
            <div className={"flex flex-row gap-2"}>
                <button className={"p-4 m-4"} onClick={() => createNewButton()}> Add Die</button>
                <button className={"p-4 m-4"} onClick={() => removeCookie("buttonList")}> Clear buttons</button>
                <button className={"p-4 m-4"} onClick={() => setRolls([])}>Clear rolls</button>
                <button className={"p-4 m-4"} onClick={() => setRolls((prev) => [...prev, {
                    name: "New roll",
                    numberOfRolls: 1,
                    modifier: 0,
                    sides: 20
                }])}>Add roll
                </button>
            </div>
            <label htmlFor={"name"} className={"text-left text-2xl"}>New buttons's Name</label>
            <input
                className={"p-4 m-4 w-50 border-2 border-gray-500 rounded-lg"}
                type={"text"} placeholder={"Name"} value={name} onChange={(e) => setName(e.target.value)}/>
            <div className={"flex flex-row gap-2 w-full"}>
                {rolls.map((roll, index) => (
                    <div className={"flex flex-col gap-2 w-full justify-center items-center"}>
                        <RollInput updateRoll={function (roll: Roll) {
                            setRolls((prev) => {
                                // Create a new array instead of mutating the previous one
                                const newRolls = [...prev];
                                newRolls[index] = roll;
                                return newRolls;
                            });
                        }} key={index} roll={roll}/>
                        <button
                            className={"p-4 m-4"}
                            onClick={() =>
                                setRolls((prevRolls) => prevRolls.filter((_, i) => i !== index))

                            }> Delete roll
                        </button>
                    </div>))}
            </div>

        </div>
        <div>
            <label htmlFor={"buttons"} className={"text-left text-2xl"}>Saved Buttons</label>
            <ul id="buttons"
                className={"flex flex-col gap-2 m-4 p-4 w-64 justify-center items-center h-fit border-2 border-gray-500 rounded-lg shadow-lg"}>
                {buttonList.map((buttonData: {
                    name: string,
                    rolls: Roll[]
                }, index: number) => {
                    return (<div className={"flex flex-row"}>
                        <RollButton rolls={buttonData.rolls} name={buttonData.name}
                                    key={index}/>
                        <button className={"p-4 m-4"} onClick={() => removeButton(index)}> Delete</button>
                    </div>)
                })}
            </ul>
        </div>
    </div>)
}