import React from "react";
import type { AppThunk } from "@/store";
import type { ButtonPath, Trigger, TriggerPath } from "@/store/button-sets/buttonSetSlice.ts";
import type { TriggerResult } from "@/store/historySidebarSlice.ts";
import { rollTriggerHandler } from "./rollTrigger/index.tsx";
import { textTriggerHandler } from "./textTrigger/index.tsx";
import { buttonTriggerHandler } from "./buttonTrigger/index.tsx";

// ── Core types ────────────────────────────────────────────────────────────────

type BaseData = Pick<Trigger, "id" | "name" | "onRoll">;

/**
 * Resolves a TriggerPath to a Trigger object.
 * Paths are globally unique, so no per-button scoping is needed.
 */
export type ResolveTrigger = (path: TriggerPath) => Trigger | undefined;

/**
 * Adds a trigger to the execution queue alongside its globally unique path.
 * The path is used if the trigger itself needs to resolve further references.
 */
export type Enqueue = (trigger: Trigger, path: TriggerPath) => void;

export type TriggerHandler<T extends Trigger> = {
    label: string;
    defaultData: (base: BaseData, previous?: Trigger) => T;
    EditorComponent: React.FC;
    CardComponent: React.FC<{ trigger: T }>;
    execute: (trigger: T, resolveTrigger: ResolveTrigger, enqueue: Enqueue, parentPath?: ButtonPath) => AppThunk<TriggerResult>;
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
    enqueue: Enqueue,
    parentPath?: ButtonPath
): AppThunk<TriggerResult> {
    return (TRIGGER_REGISTRY[trigger.type] as TriggerHandler<Trigger>).execute(
        trigger,
        resolveTrigger,
        enqueue,
        parentPath
    );
}
