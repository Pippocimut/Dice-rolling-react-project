import type {Roll} from "../../types.ts";
import {useState} from "react";

export function RollInput({roll, updateRoll}: { roll: Roll, updateRoll: (roll: Roll) => void }) {
    const labelClassName = "text-left"
    const dieInputClassname = "p-4 w-50 border-2 border-gray-500 rounded-lg text-right"

    const [name, setName] = useState(roll.name || "")
    const [nameError, setNameError] = useState("")

    const [sides, setSides] = useState(roll.sides || "")
    const [sidesError, setSidesError] = useState("")

    const [numberOfRolls, setNumberOfRolls] = useState(roll.numberOfRolls || "")
    const [numberOfRollsError, setNumberOfRollsError] = useState("")

    const [modifier, setModifier] = useState(roll.modifier || "")
    const [modifierError, setModifierError] = useState("")

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameError("")
        updateRoll({...roll, name: e.target.value})
    }

    const handleSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (Number(e.target.value) < 1 && e.target.value != "") {
            return
        }

        if (e.target.value == "-") return

        setSides(e.target.value)
        if (isNaN(Number(e.target.value))) {
            setSidesError("Must be a number")
            return
        }

        setSidesError("")
        updateRoll({...roll, sides: Number(e.target.value)})
    }

    const handleNumberOfRollsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (Number(e.target.value) < 1 && e.target.value != "") {
            return
        }

        if (e.target.value == "-") return

        setNumberOfRolls(e.target.value)
        if (isNaN(Number(e.target.value))) {
            setNumberOfRollsError("Must be a number")
            return
        }

        setNumberOfRollsError("")
        updateRoll({...roll, numberOfRolls: Number(e.target.value)})
    }

    const handleModifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModifier(e.target.value)
        if(e.target.value == "-" || e.target.value == "") return
        if (isNaN(Number(e.target.value))) {
            setModifierError("Must be a number")
            return
        }

        setModifierError("")
        updateRoll({...roll, modifier: Number(e.target.value)})
    }

    return (
        <div className={"flex flex-col gap-2 w-full justify-center items-center"}>
            <label className={labelClassName}>Roll name: {nameError &&
                <span className={"text-red-500"}> {nameError}</span>}</label>
            <input type={"text"} placeholder={"Roll Name"} value={name}
                   className={dieInputClassname}
                   onChange={handleNameChange}/>
            <label className={labelClassName}>Sides: {sidesError &&
                <span className={"text-red-500"}> {sidesError}</span>}</label>
            <input type={"text"} placeholder={"Sides"} value={sides}
                   className={dieInputClassname}
                   onChange={handleSidesChange}/>
            <label className={labelClassName}>Number of Rolls: {numberOfRollsError &&
                <span className={"text-red-500"}> {numberOfRollsError}</span>}</label>
            <input type={"text"} placeholder={"Number of Rolls"} value={numberOfRolls}
                   className={dieInputClassname}
                   onChange={handleNumberOfRollsChange}/>
            <label className={labelClassName}>Modifier: {modifierError &&
                <span className={"text-red-500"}> {modifierError}</span>}</label>
            <input type={"text"} placeholder={"Modifier"} value={modifier}
                   className={dieInputClassname}
                   onChange={handleModifierChange}/>
        </div>
    )
}