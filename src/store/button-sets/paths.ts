// ── Segment types ─────────────────────────────────────────────────────────────
// Each segment is one level in the entity hierarchy.
// To add a new entity kind (e.g. "note" inside a button, "item" inside a set):
//   1. Add its segment type here
//   2. Add it to PathSegment
//   3. Add a concrete path type below
//   4. Add a factory to makePath
//   5. Add a resolver branch in resolveEntity.ts

export type SetSegment = { kind: "sets"; id: number }
export type ButtonSegment = { kind: "buttons"; id: number }
export type TriggerSegment = { kind: "triggers"; id: number }

export type PathSegment = SetSegment | ButtonSegment | TriggerSegment

// ── Concrete path types ───────────────────────────────────────────────────────
// Typed tuples enforce hierarchy at compile time.
// TypeScript will refuse a ButtonPath where a TriggerPath is expected.

export type SetPath = [SetSegment]
export type ButtonPath = [SetSegment, ButtonSegment]
export type TriggerPath = [SetSegment, ButtonSegment, TriggerSegment]

export type EntityPath = SetPath | ButtonPath | TriggerPath

// ── Path factory ──────────────────────────────────────────────────────────────

export const makePath = {
    set: (setId: number): SetPath => [
        { kind: "sets", id: setId },
    ],

    button: (setId: number, buttonId: number): ButtonPath => [
        { kind: "sets", id: setId },
        { kind: "buttons", id: buttonId },
    ],

    trigger: (setId: number, buttonId: number, triggerId: number): TriggerPath => [
        { kind: "sets", id: setId },
        { kind: "buttons", id: buttonId },
        { kind: "triggers", id: triggerId },
    ],
}

// ── Display ───────────────────────────────────────────────────────────────────
// "set:1/button:3/trigger:4"

export const pathToString = (path: EntityPath): string =>
    path.map((s) => `${s.kind}:${s.id}`).join("/")
