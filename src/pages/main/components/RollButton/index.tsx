import {toast} from "react-toastify";
import type {Roll} from "../../types";
import {evaluate} from "mathjs"

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
            const {modifier = 0, name, equation} = roll;

            let total = modifier;
            let totalAdv = modifier;
            let totalDis = modifier;

            let normaledEquation = ""
            let advantageEquation = ""
            let disadvantageEquation = ""

            console.log(equation)
            const equationComponents = equation
                .split(/(\s*[+\-*/()^]\s*)/g)
                .filter(Boolean)
                .map(component => component.trim());

            for (const component of equationComponents) {
                if (component === " ") continue;
                if (component.includes("d")) {
                    const [numberOfRolls, sides] = component.split("d").map(Number);
                    normaledEquation += "( ";
                    advantageEquation += "( ";
                    disadvantageEquation += "( ";

                    for (let i = 0; i < numberOfRolls; i++) {
                        const result1 = Math.floor(Math.random() * sides) + 1;
                        const result2 = Math.floor(Math.random() * sides) + 1;

                        if (i === 0) {
                            normaledEquation += result1
                            advantageEquation += Math.max(result1, result2)
                            disadvantageEquation += Math.min(result1, result2)
                            continue;
                        }
                        normaledEquation += " + " + result1
                        advantageEquation += " + " + Math.max(result1, result2)
                        disadvantageEquation += " + " + Math.min(result1, result2)
                    }

                    normaledEquation += " )"
                    advantageEquation += " )"
                    disadvantageEquation += " )"

                } else {
                    normaledEquation += " " + component
                    advantageEquation += " " + component
                    disadvantageEquation += " " + component
                }
            }

            console.log(normaledEquation)
            console.log(advantageEquation)
            console.log(disadvantageEquation)

            total += evaluate(normaledEquation)
            totalAdv += evaluate(advantageEquation)
            totalDis += evaluate(disadvantageEquation)

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

    return (
        <button
            className={`w-50 h-50 rounded-lg ${color}`}
            onClick={handleOnClick}
            onContextMenu={(e) => {
                e.preventDefault();
                deleteButton()
            }}>
            <span className={"text-2xl"}>{name} </span>
        </button>
    )
}
