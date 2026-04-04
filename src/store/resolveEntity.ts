// resolveEntity lives in its own file to avoid a circular dependency:
//   ButtonSetV1.3  →  paths.ts  (path types used in store types)
//   resolveEntity  →  paths.ts + store/index (RootState)
// If resolveEntity were inside paths.ts it would close a cycle with the store.

import type { RootState } from "@/store";
import type { ButtonSet, ButtonData, Trigger } from "@/store/button-sets/buttonSetSlice";
import type { SetPath, ButtonPath, TriggerPath, EntityPath, PathSegment } from "./paths";

// ── Overloads ─────────────────────────────────────────────────────────────────
// Each concrete path type maps to its specific return type.
// Extend with new overloads when new entity kinds are added.

export function resolveEntity(state: RootState, path: TriggerPath): Trigger    | undefined
export function resolveEntity(state: RootState, path: ButtonPath):  ButtonData | undefined
export function resolveEntity(state: RootState, path: SetPath):     ButtonSet  | undefined
export function resolveEntity(
    state: RootState,
    path: EntityPath,
): Trigger | ButtonData | ButtonSet | undefined {
    const segments = path as PathSegment[]
    const [setSegment, childSegment, leafSegment] = segments

    const set = state.buttonSet.sets[setSegment.id]
    if (!set || !childSegment) return set

    if (childSegment.kind === "button") {
        const button = set.buttonList[childSegment.id]
        if (!button || !leafSegment) return button

        // Add new leaf kinds here as new entity types are introduced inside buttons
        if (leafSegment.kind === "trigger") {
            return button.triggers[leafSegment.id]
        }
    }

    return undefined
}
