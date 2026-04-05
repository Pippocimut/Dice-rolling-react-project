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

export function resolveEntity(state: RootState, path: TriggerPath): Trigger | undefined
export function resolveEntity(state: RootState, path: ButtonPath): ButtonData | undefined
export function resolveEntity(state: RootState, path: SetPath): ButtonSet | undefined
export function resolveEntity(
    state: RootState,
    path: EntityPath,
): Trigger | ButtonData | ButtonSet | undefined {
    const segments = path as PathSegment[]
    let item: any = state.buttonSet

    for (const segment of segments) {
        item = item?.[segment.kind]?.[segment.id]
        if (!item) return undefined
    }

    return item
}
