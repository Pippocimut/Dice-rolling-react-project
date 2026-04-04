/**
 * Trigger Registry
 *
 * Single source of truth for every trigger type. Adding a new trigger type
 * means adding one entry here — TypeScript will flag every place that needs
 * updating via the exhaustive `TriggerRegistry` mapped type.
 *
 * Each entry defines:
 *   label          — display name used in dropdowns / UI
 *   defaultData    — factory that builds a ready-to-use trigger from base fields;
 *                    receives the previous trigger so switching types can preserve data
 *   EditorComponent — React component rendered inside the dialog for this type
 *   execute        — pure(-ish) function that runs the trigger and returns its result;
 *                    calls queueTrigger for any side-effect IDs that should chain
 */

import React from "react";
import { evaluate } from "mathjs";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { RootState } from "@/store";
import { setRoll } from "@/store/buttonManageSlice.ts";
import type {
    Equation,
    RollTrigger,
    SideEffect,
    TextTrigger,
    Trigger,
} from "@/store/button-sets/buttonSetSlice.ts";
import type { RollTriggerResult, TextTriggerResult, TriggerResult } from "@/store/historySidebarSlice.ts";
import {
    GeneralTriggersV12,
    SideEffectConditionsV12,
    type SideEffectConditionsTypeV12,
} from "@/store/button-sets/ButtonSetV1.2.ts";
import { EquationList } from "./dialogs/forms/RollForms/EquationList.tsx";
import { useEquations } from "./dialogs/forms/RollForms/hooks/useEquations.tsx";

// ── Core types ────────────────────────────────────────────────────────────────

type BaseData = Pick<Trigger, "id" | "name" | "onRoll">;

export type TriggerHandler<T extends Trigger> = {
    label: string;
    defaultData: (base: BaseData, previous?: Trigger) => T;
    EditorComponent: React.FC;
    execute: (trigger: T, queueTrigger: (id: number) => void) => TriggerResult;
};

/**
 * Mapped type: forces every key of the union to be handled.
 * Adding "sound" to Trigger["type"] without adding it here is a compile error.
 */
export type TriggerRegistry = {
    [K in Trigger["type"]]: TriggerHandler<Extract<Trigger, { type: K }>>;
};

// ── Execution helpers (private) ───────────────────────────────────────────────

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

const resolvedSideEffectIds = (sideEffects: SideEffect[], total: number): number[] =>
    sideEffects
        .filter((se) => conditionMatches(total, se.values, se.condition))
        .map((se) => se.triggerId)
        .filter((id) => id !== GeneralTriggersV12.None && id !== GeneralTriggersV12.OnRoll);

const executeEquations = (
    equations: Record<number, Equation>,
    queueTrigger: (id: number) => void
): { total: number; result: string } => {
    let total = 0;
    let result = "";

    for (const equation of Object.values(equations)) {
        const { result: r, normalizedEquation } = solveEquation(getComponents(equation.formula));
        const eqTotal = evaluate(normalizedEquation) as number;
        resolvedSideEffectIds(Object.values(equation.sideEffects ?? {}), eqTotal).forEach(queueTrigger);
        total += eqTotal;
        result += ` + ${r}`;
    }

    return { total, result: result.trim().slice(2) };
};

// ── Editor components (private) ───────────────────────────────────────────────

const RollTriggerEditor: React.FC = () => {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const { addEquation } = useEquations();

    if (trigger.type !== "roll") return null;

    return (
        <div className="flex flex-col bg-background text-text gap-2 h-fit w-full justify-start items-start">
            <Label htmlFor="rollEquation">Equations:</Label>
            <EquationList roll={trigger} />
            <Button variant="outline" className="w-fit" onClick={addEquation}>
                Add Equation
            </Button>
        </div>
    );
};

const TextTriggerEditor: React.FC = () => {
    const trigger = useSelector((state: RootState) => state.buttonManage.trigger);
    const dispatch = useDispatch();

    if (trigger.type !== "text") return null;

    return (
        <div className="flex flex-col bg-background text-text gap-2 h-fit w-full justify-start items-start">
            <Label htmlFor="rollText">Text:</Label>
            <Input
                id="rollText"
                placeholder="Text to display on roll"
                value={trigger.text}
                onChange={(e) => dispatch(setRoll({ ...trigger, text: e.target.value }))}
            />
        </div>
    );
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const TRIGGER_REGISTRY: TriggerRegistry = {
    roll: {
        label: "Roll",

        defaultData: (base, previous) => ({
            ...base,
            type: "roll",
            nextEquationId: previous?.type === "roll" ? previous.nextEquationId : 2,
            equations:
                previous?.type === "roll"
                    ? previous.equations
                    : { 1: { id: 1, formula: "1d20+0", nextSideEffectId: 1, sideEffects: {} } },
        } satisfies RollTrigger),

        EditorComponent: RollTriggerEditor,

        execute: (trigger, queueTrigger): RollTriggerResult => {
            const { total, result } = executeEquations(trigger.equations, queueTrigger);
            return { type: "roll", name: trigger.name, total, result };
        },
    },

    text: {
        label: "Text",

        defaultData: (base, previous) => ({
            ...base,
            type: "text",
            text: previous?.type === "text" ? previous.text : "Triggered!",
        } satisfies TextTrigger),

        EditorComponent: TextTriggerEditor,

        execute: (trigger): TextTriggerResult => ({
            type: "text",
            name: trigger.name,
            text: trigger.text ?? "",
        }),
    },
};

// ── Dispatch helper ───────────────────────────────────────────────────────────

/**
 * Type-safe entry point for executing any trigger.
 * The single cast here is intentional: the mapped TriggerRegistry type guarantees
 * that TRIGGER_REGISTRY[trigger.type] accepts exactly that trigger's shape.
 */
export function executeTrigger(
    trigger: Trigger,
    queueTrigger: (id: number) => void
): TriggerResult {
    return (TRIGGER_REGISTRY[trigger.type] as TriggerHandler<Trigger>).execute(
        trigger,
        queueTrigger
    );
}
