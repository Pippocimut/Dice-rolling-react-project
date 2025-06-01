import {toast} from "react-toastify";
import type {Roll} from "../../types";

type Props = {
    rolls: Roll[];
    name: string;
    deleteButton: () => void;
    color: string;
}

export function RollButton({rolls, name, deleteButton, color}: Props) {

    const handleOnClick = () => {
        const results = []
        for (const roll of rolls) {
            const {sides, numberOfRolls = 1, modifier = 0, name} = roll;

            let total = modifier;
            let totalAdv = modifier;
            let totalDis = modifier;

            for (let i = 0; i < numberOfRolls; i++) {
                const roll1 = Math.floor(Math.random() * sides) + 1;
                const roll2 = Math.floor(Math.random() * sides) + 1;
                total += roll1;
                totalAdv += Math.max(roll1, roll2);
                totalDis += Math.min(roll1, roll2);
            }

            results.push({name, total, totalAdv, totalDis})

        }

        toast.success(<div className={"flex flex-col items-start"}>
                {results.map(({name, total, totalAdv, totalDis}) => (
                    <div className={"text-left py-4"}>
                        <p>Roll for: {name}</p>
                        <p>Total: {total}</p>
                        <p>With Advantage: {totalAdv}</p>
                        <p>With Disadvantage: {totalDis}</p>
                    </div>
                ))}
            </div>
        )
    }

    console.log(color)
    return (
        <button
            className={`w-50 h-50 rounded-lg ${color}`}
            onClick={handleOnClick}
            onContextMenu={(e) => {
                e.preventDefault()
                deleteButton()

            }}
        ><span className={"text-2xl"}>{name} </span></button>
    )
}
