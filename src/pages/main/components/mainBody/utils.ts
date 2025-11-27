import {type ButtonSet, type RollMap, type SideEffect} from "@/store/button-sets/buttonSetSlice.ts";
import {evaluate} from "mathjs";
import type {RollResult} from "@/store/history-sidebar/historySidebarSlice.ts";
import { GeneralTriggersV12, SideEffectConditionsV12, type SideEffectConditionsTypeV12 } from "@/store/button-sets/ButtonSetV1.2";

export function getSortedTags(buttonSet: ButtonSet) {
    const tagCounts = Object.values(buttonSet.buttonList).reduce((counts, button) => {
        if (!button) return counts;
        if (
            button.tag !== undefined &&
            button.tag !== null &&
            button.tag !== -1
        ) {
            counts[button.tag] = (counts[button.tag] || 0) + 1;
        }
        return counts;
    }, {} as Record<number, number>);

    return [...(Object.values(buttonSet.tags) || [])].sort(
        (a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0)
    );
}

export function calculateButtonRoll(rolls: RollMap, triggerQueue: number[]) {

    const newTriggerQueue: number[] = []
    const results: RollResult[] = []

    const activeRolls = Object.values(rolls).filter(roll => {
            triggerQueue.includes(roll.trigger)
            if (roll.trigger === GeneralTriggersV12.OnRoll && triggerQueue.includes(GeneralTriggersV12.OnRoll)) {
                return true;
            } else {
                return triggerQueue.includes(roll.id)
            }
        }
    )

    triggerQueue.forEach(trigger => {
        const rolls = activeRolls.filter(roll => {
                triggerQueue.includes(roll.trigger)
                if (roll.trigger === GeneralTriggersV12.OnRoll && trigger === GeneralTriggersV12.OnRoll) {
                    return true;
                } else {
                    return trigger === roll.id
                }
            }
        )


        results.push(...rolls.reduce((acc, roll) => {

                const {name, equations} = roll;

                let total = 0;
                let result = ""

                for (const equation of Object.values(equations)) {
                    const {
                        result: result3,
                        normalizedEquation: normalizedEquation3
                    } = EquationSolver(getComponents(equation.formula));

                    const total3 = evaluate(normalizedEquation3);

                    const {triggers} = evaluateTriggers(Object.values(equation?.sideEffects ?? {}), total3)
                    newTriggerQueue.push(...triggers)

                    total += total3;
                    result += " + " + result3

                }

                acc.push({name, total, result: result.trim().slice(2)});
                return acc
            }

            ,
            [] as RollResult[]
        ))

    })

    triggerQueue = newTriggerQueue

    return {results, triggerQueue}
}

const EquationSolver = (equationComponents: string[]) => {

    let stringEquation = "";
    let pureEquation = "";

    for (const component of equationComponents) {
        if (component.includes("d")) {
            stringEquation += component + "(";
            const [numberOfRolls, sides] = component.split("d").map(Number);
            pureEquation += "( ";

            for (let i = 0; i < numberOfRolls; i++) {
                const result1 = Math.floor(Math.random() * sides) + 1;
                stringEquation += i === 0 ? result1 : "," + result1;
                pureEquation += (i === 0 ? "" : " + ") + result1;
            }

            stringEquation += ")";
            pureEquation += " )";
        } else {
            stringEquation += " " + component + " ";
            pureEquation += " " + component;
        }
    }

    return {result: stringEquation, normalizedEquation: pureEquation}
}

const getComponents = (equation: string) => equation.split(/(\s*[+\-*/()^]\s*)/g)
    .filter(Boolean)
    .map((component) => component.trim());

const evaluateTriggers = (sideEffects: SideEffect[], total: number) => {
    const triggers: number[] = []
    for (const sideEffect of sideEffects) {
        if (triggerComparation(total, sideEffect.values, sideEffect.condition)) triggers.push(sideEffect.triggerId)
    }
    return {triggers: triggers.filter(trigger => trigger !== GeneralTriggersV12.None && trigger !== GeneralTriggersV12.OnRoll)}
}

const triggerComparation = (total: number, values: number[], condition: SideEffectConditionsTypeV12) => {
    switch (condition) {
        case SideEffectConditionsV12.EqualTo:
            return total === values[0];
        case SideEffectConditionsV12.GreaterThan:
            return total > values[0];
        case SideEffectConditionsV12.LessThan:
            return total < values[0];
        case SideEffectConditionsV12.NotEqualTo:
            return total !== values[0];
        case SideEffectConditionsV12.GreaterEqualTo:
            return total >= values[0];
        case SideEffectConditionsV12.LessEqualTo:
            return total <= values[0];
        case SideEffectConditionsV12.Between:
            return total >= values[0] && total <= values[1];
        case SideEffectConditionsV12.NotBetween:
            return total < values[0] || total > values[1];
        case SideEffectConditionsV12.Always:
            return true;
        default:
            return false;
    }
}

