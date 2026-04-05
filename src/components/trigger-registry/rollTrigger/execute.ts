import type { Equation, SideEffect } from "@/store/button-sets/buttonSetSlice";
import { SideEffectConditionsV12, type SideEffectConditionsTypeV12 } from "@/store/button-sets/ButtonSetV1.2";
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

// Returns only side effects that matched and have a non-null target path.
const matchedSideEffects = (sideEffects: SideEffect[], total: number) =>
  sideEffects.filter(
    (se) => se.target !== null && conditionMatches(total, se.values, se.condition)
  ) as (SideEffect & { target: NonNullable<SideEffect["target"]> })[];

/**
 * Evaluates all equations and enqueues any matched side effects.
 *
 * `resolveTrigger` resolves a TriggerPath to a Trigger using the full store
 * state — paths are globally unique so no per-button scoping is needed.
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

    matchedSideEffects(Object.values(equation.sideEffects ?? {}), eqTotal)
      .forEach((se) => {
        const trigger = resolveTrigger(se.target);
        if (trigger) enqueue(trigger, se.target);
      });

    total += eqTotal;
    result += ` + ${r}`;
  }

  return { total, result: result.trim().slice(2) };
};
