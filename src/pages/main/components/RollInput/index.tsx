import type {Roll} from "../../types.ts";
import {useState} from "react";

export function RollInput({createRoll}: {
    createRoll: (roll: Roll) => void
}) {
    const labelClassName = "text-left"
    const dieInputClassname = "p-4 w-50 border-2 border-gray-500 rounded-lg text-right"

    const [roll, updateRoll] = useState<Roll>({
        name: "New roll",
        equation: `${1}d${20}+0`
    })

    const [name, setName] = useState(roll.name ||"")
    const [nameError, setNameError] = useState("")

    const [equation, setEquation] = useState(roll.equation || "")
    const [equationError, setEquationError] = useState("")

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameError("")
        updateRoll({...roll, name: e.target.value})
    }

    const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEquation(e.target.value)
        setEquationError("")
        updateRoll({...roll, equation: e.target.value})
    }

    return (
        <div className={"flex flex-col gap-2 w-full justify-center items-center"}>
            <label className={labelClassName}>Roll name: {nameError &&
                <span className={"text-red-500"}> {nameError}</span>}</label>
            <input type={"text"} placeholder={"Roll Name"} value={name}
                   className={dieInputClassname}
                   onChange={handleNameChange}/>
            <label className={labelClassName} >Equation: { equationError && <span className={"text-red-500"}> {equationError}</span>} </label>
            <input type={"text"} placeholder={"Equation"} value={equation} className={dieInputClassname} onChange={handleEquationChange}/>
            <button className={"p-4 m-4"} onClick={() => {
                createRoll(roll)
            }}>Add Roll</button>
        </div>
    )
}