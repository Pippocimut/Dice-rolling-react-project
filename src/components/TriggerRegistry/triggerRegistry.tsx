import React from "react";
import type { AppThunk } from "@/store";
import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import type { TriggerResult } from "@/store/historySidebarSlice.ts";
import { rollTriggerHandler } from "./rollTrigger/index.tsx";
import { textTriggerHandler } from "./textTrigger/index.tsx";
import { buttonTriggerHandler } from "./buttonTrigger/index.tsx";

// ── Core types ────────────────────────────────────────────────────────────────

type BaseData = Pick<Trigger, "id" | "name" | "onRoll">;

/**
 * Resolves a trigger ID to a Trigger object within a specific button's scope.
 * Each handler receives the resolver that matches the button it came from,
 * so ID lookups are never ambiguous even if two buttons share the same ID.
 */
export type ResolveTrigger = (id: number) => Trigger | undefined;

/**
 * Adds a trigger to the execution queue, paired with its resolver.
 * The resolver travels with the trigger so that when it eventually executes
 * its own side effects, it resolves IDs against the correct button — not
 * whatever button happened to start the press.
 */
export type Enqueue = (trigger: Trigger, resolveTrigger: ResolveTrigger) => void;

export type TriggerHandler<T extends Trigger> = {
    label: string;
    defaultData: (base: BaseData, previous?: Trigger) => T;
    EditorComponent: React.FC;
    CardComponent: React.FC<{ trigger: T }>;
    execute: (trigger: T, resolveTrigger: ResolveTrigger, enqueue: Enqueue) => AppThunk<TriggerResult>;
};

export type TriggerRegistry = {
    [K in Trigger["type"]]: TriggerHandler<Extract<Trigger, { type: K }>>;
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const TRIGGER_REGISTRY: TriggerRegistry = {
    roll: rollTriggerHandler,
    text: textTriggerHandler,
    button: buttonTriggerHandler,
};

// ── Dispatch helper ───────────────────────────────────────────────────────────

export function executeTrigger(
    trigger: Trigger,
    resolveTrigger: ResolveTrigger,
    enqueue: Enqueue
): AppThunk<TriggerResult> {
    return (TRIGGER_REGISTRY[trigger.type] as TriggerHandler<Trigger>).execute(
        trigger,
        resolveTrigger,
        enqueue
    );
}
