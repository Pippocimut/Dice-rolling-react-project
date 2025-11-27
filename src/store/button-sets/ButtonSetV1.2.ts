export type RollV12 = TriggerV12 & {
    trigger: number;
    nextEquationId: number,
    equations: EquationRecordV12;
}

export type EquationRecordV12 = Record<number, EquationV12>

export type SideEffectV12 = {
    id: number;
    condition: SideEffectConditionsTypeV12,
    values: number[],
    triggerId: number,
}

export type SideEffectsMapV12 = Record<number, SideEffectV12>

export type EquationV12 = {
    id: number;
    formula: string,
    nextSideEffectId: number,
    sideEffects?: SideEffectsMapV12
}

export type TagV12 = {
    id: number;
    color: string;
    name: string;
    buttonConfig: Partial<ButtonDataV12>
}
export type TriggerV12 = {
    id: number;
    name: string;
}

export type TriggersMapV12 = Record<number, TriggerV12>
export type RollMapV12 = Record<number, RollV12>

export type ButtonDataV12 = {
    id: number;
    name: string;
    color: string;
    tag?: number;
    position: number;

    nextTriggerId: number;
    nextRollId: number;
    rolls: RollMapV12;
    triggers: TriggersMapV12;
};

export type BaseButtonSetV12 = {
    version: string
}

export type ButtonSetV12 = BaseButtonSetV12 & {
    id: number;
    version: "1.2";
    name: string;
    tags: Record<number, TagV12>;
    buttonList: Record<number, ButtonDataV12>;
}

export type ButtonSetStateV12 = {
    nextSetId: number;
    nextButtonId: number;
    nextTagId: number;
    currentVersion: string;
    selectedSetId: number;
    sets: Record<number, ButtonSetV12>;
}

export const colorsV12 = [
    "red-roll-button",
    "orange-roll-button",
    "yellow-roll-button",
    "green-roll-button",
    "blue-roll-button",
    "purple-roll-button",
    "pink-roll-button",
    "gray-roll-button"
];

// Use PascalCase for enum names
export const GeneralTriggersV12 = {
    OnRoll: 0,
    None: -1,
}

export type SideEffectConditionsTypeV12 = "Always" | "Between" | "Not between" | "Equal to" | "Not equal to" | "Greater than" | "Less than" | "Greater than or equal to" | "Less than or equal to";

// String-valued enums are fine, but be consistent with naming
export const SideEffectConditionsV12: Record<string,SideEffectConditionsTypeV12 > = {
    EqualTo : "Equal to",
    NotEqualTo : "Not equal to",
    GreaterThan : "Greater than",
    LessThan : "Less than",
    GreaterEqualTo : "Greater than or equal to",
    LessEqualTo : "Less than or equal to",
    Between : "Between",
    NotBetween : "Not between",
    Always : "Always"
}

// Fixed: PascalCase for enum name and members
export const TagIdsV12 = {
    Attack : 1,
    SavingThrow : 2,
    Check : 3
}
