import type {Roll} from "../../types.ts";

export function RollInput({roll,updateRoll}: { roll: Roll, updateRoll: (roll: Roll) => void }) {

    const labelClassName = "text-left"
    const dieInputClassname = "p-4 w-50 border-2 border-gray-500 rounded-lg text-right"

    return (
        <div className={"flex flex-col gap-2"}>
            <label className={labelClassName}>Roll name</label>
            <input type={"text"} placeholder={"Roll Name"} value={roll.name}
                   className={dieInputClassname}
                   onChange={(e) => updateRoll({...roll, name: e.target.value})}/>
            <label className={labelClassName}>Sides</label>
            <input type={"number"} placeholder={"Sides"} value={roll.sides}
                   className={dieInputClassname}
                   onChange={(e) => updateRoll({...roll, sides: Number(e.target.value)})}/>
            <label className={labelClassName}>Number of Rolls</label>
            <input type={"number"} placeholder={"Number of Rolls"} value={roll.numberOfRolls}
                   className={dieInputClassname}
                   onChange={(e) => updateRoll({...roll, numberOfRolls: Number(e.target.value)})}/>
            <label className={labelClassName}>Modifier</label>
            <input type={"number"} placeholder={"Modifier"} value={roll.modifier}
                   className={dieInputClassname}
                   onChange={(e) => updateRoll({...roll, modifier: Number(e.target.value)})}/>
        </div>
    )
}