import type {Roll} from "@/pages/main/types.ts";
import {evaluate} from "mathjs";
import type {RollResult} from "@/store/history-sidebar/historySidebarSlice.ts";

export function calculateButtonRoll(rolls: Roll[]) {
    return rolls.reduce((acc, roll) => {
        const {name, equation} = roll;
        let total = 0;
        let result = "";
        let normalizedEquation = "";

        const equationComponents = equation
            .split(/(\s*[+\-*/()^]\s*)/g)
            .filter(Boolean)
            .map((component) => component.trim());

        for (const component of equationComponents) {
            if (component.includes("d")) {
                result += component + "(";
                const [numberOfRolls, sides] = component.split("d").map(Number);
                normalizedEquation += "( ";

                for (let i = 0; i < numberOfRolls; i++) {
                    const result1 = Math.floor(Math.random() * sides) + 1;
                    result += i === 0 ? result1 : "," + result1;
                    normalizedEquation += (i === 0 ? "" : " + ") + result1;
                }

                result += ")";
                normalizedEquation += " )";
            } else {
                result += " " + component + " ";
                normalizedEquation += " " + component;
            }
        }

        total += evaluate(normalizedEquation);

        acc.push({name, total, result});
        return acc
    }, [] as RollResult[])
}
