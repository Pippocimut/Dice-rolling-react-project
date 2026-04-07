// resolveEntity lives in its own file to avoid a circular dependency:
//   ButtonSetV1.3  →  paths.ts  (path types used in store types)
//   resolveEntity  →  paths.ts + store/index (RootState)
// If resolveEntity were inside paths.ts it would close a cycle with the store.

import type { RootState } from "@/store";
import type { ButtonSet, ButtonData, Trigger } from "@/store/button-sets/buttonSetSlice";
import type { SetPath, ButtonPath, TriggerPath, EntityPath } from "./paths";

// ── Overloads ─────────────────────────────────────────────────────────────────
// Each concrete path type maps to its specific return type.
// Extend with new overloads when new entity kinds are added.

export function resolveEntity(state: RootState, path: TriggerPath): Trigger | undefined
export function resolveEntity(state: RootState, path: ButtonPath): ButtonData | undefined
export function resolveEntity(state: RootState, path: SetPath): ButtonSet | undefined
export function resolveEntity(
    state: RootState,
    path: EntityPath,
): Trigger | ButtonData | ButtonSet | undefined {
    const [setSegment, buttonSegment, triggerSegment] = path

    const set = state.buttonSet.sets[setSegment.id]
    if (!buttonSegment || !set) return set

    const button = set.buttons[buttonSegment.id]
    if (!triggerSegment || !button) return button

    return button.triggers[triggerSegment.id]
}
