import type { Equation, SideEffect, Trigger } from "@/store/button-sets/buttonSetSlice";
import { GeneralTriggersV12, SideEffectConditionsV12, type SideEffectConditionsTypeV12 } from "@/store/button-sets/ButtonSetV1.2";
import type { Enqueue, ResolveTrigger } from "../triggerRegistry";
import { evaluate } from "mathjs";

const getComponents = (formula: string): string[] =>
  formula
    .split(/(\s*[+\-*/()^]\s*)/g)
    .filter(Boolean)
    .map((c) => c.trim());

const solveEquation = (components: string[]): { result: string; normalizedEquation: string } => {
  let result = "";
  let normalizedEquation = "";

  for (const component of components) {
    if (component.includes("d")) {
      const [numberOfRolls, sides] = component.split("d").map(Number);
      result += component + "(";
      normalizedEquation += "( ";
      for (let i = 0; i < numberOfRolls; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        result += i === 0 ? roll : "," + roll;
        normalizedEquation += (i === 0 ? "" : " + ") + roll;
      }
      result += ")";
      normalizedEquation += " )";
    } else {
      result += ` ${component} `;
      normalizedEquation += ` ${component}`;
    }
  }

  return { result, normalizedEquation };
};

const conditionMatches = (
  total: number,
  values: number[],
  condition: SideEffectConditionsTypeV12
): boolean => {
  switch (condition) {
    case SideEffectConditionsV12.EqualTo:        return total === values[0];
    case SideEffectConditionsV12.NotEqualTo:     return total !== values[0];
    case SideEffectConditionsV12.GreaterThan:    return total > values[0];
    case SideEffectConditionsV12.LessThan:       return total < values[0];
    case SideEffectConditionsV12.GreaterEqualTo: return total >= values[0];
    case SideEffectConditionsV12.LessEqualTo:    return total <= values[0];
    case SideEffectConditionsV12.Between:        return total >= values[0] && total <= values[1];
    case SideEffectConditionsV12.NotBetween:     return total < values[0] || total > values[1];
    case SideEffectConditionsV12.Always:         return true;
    default:                                     return false;
  }
};

const matchedSideEffectIds = (sideEffects: SideEffect[], total: number): number[] =>
  sideEffects
    .filter((se) => conditionMatches(total, se.values, se.condition))
    .map((se) => se.triggerId)
    .filter((id) => id !== GeneralTriggersV12.None && id !== GeneralTriggersV12.OnRoll);

/**
 * Evaluates all equations and enqueues any matched side effects.
 *
 * `resolveTrigger` and `enqueue` are passed in from the handler so that:
 * - IDs are resolved against the correct button (no global uniqueness assumed)
 * - Chained triggers carry the same resolver, keeping them scoped to the
 *   same button throughout their own execution
 */
export const executeEquations = (
  equations: Record<number, Equation>,
  resolveTrigger: ResolveTrigger,
  enqueue: Enqueue
): { total: number; result: string } => {
  let total = 0;
  let result = "";

  for (const equation of Object.values(equations)) {
    const { result: r, normalizedEquation } = solveEquation(getComponents(equation.formula));
    const eqTotal = evaluate(normalizedEquation) as number;

    matchedSideEffectIds(Object.values(equation.sideEffects ?? {}), eqTotal)
      .forEach((id) => {
        const trigger = resolveTrigger(id);
        // Chained trigger gets the same resolver — it belongs to the same button
        if (trigger) enqueue(trigger, resolveTrigger);
      });

    total += eqTotal;
    result += ` + ${r}`;
  }

  return { total, result: result.trim().slice(2) };
};
