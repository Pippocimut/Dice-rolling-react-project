// ── Segment types ─────────────────────────────────────────────────────────────
// Each segment is one level in the entity hierarchy.
// To add a new entity kind (e.g. "note" inside a button, "item" inside a set):
//   1. Add its segment type here
//   2. Add it to PathSegment
//   3. Add a concrete path type below
//   4. Add a factory to makePath
//   5. Add a resolver branch in resolveEntity.ts

export type SetSegment     = { kind: "set";     id: number }
export type ButtonSegment  = { kind: "button";  id: number }
export type TriggerSegment = { kind: "trigger"; id: number }

export type PathSegment = SetSegment | ButtonSegment | TriggerSegment

// ── Concrete path types ───────────────────────────────────────────────────────
// Typed tuples enforce hierarchy at compile time.
// TypeScript will refuse a ButtonPath where a TriggerPath is expected.

export type SetPath     = readonly [SetSegment]
export type ButtonPath  = readonly [SetSegment, ButtonSegment]
export type TriggerPath = readonly [SetSegment, ButtonSegment, TriggerSegment]

export type EntityPath = SetPath | ButtonPath | TriggerPath

// ── Path factory ──────────────────────────────────────────────────────────────

export const makePath = {
    set: (setId: number): SetPath => [
        { kind: "set", id: setId },
    ],

    button: (setId: number, buttonId: number): ButtonPath => [
        { kind: "set",    id: setId },
        { kind: "button", id: buttonId },
    ],

    trigger: (setId: number, buttonId: number, triggerId: number): TriggerPath => [
        { kind: "set",     id: setId },
        { kind: "button",  id: buttonId },
        { kind: "trigger", id: triggerId },
    ],
}

// ── Display ───────────────────────────────────────────────────────────────────
// "set:1/button:3/trigger:4"

export const pathToString = (path: EntityPath): string =>
    path.map((s) => `${s.kind}:${s.id}`).join("/")
