export type BaseTriggerV13 = {
    id: number;
    onRoll: boolean
    type: "roll" | "text";
    name: string;
}

export type RollTriggerV13 = BaseTriggerV13 & {
    type: "roll";

    nextEquationId: number,
    equations: EquationRecordV13;
}

export type TextTriggerV13 = BaseTriggerV13 & {
    type: "text";
    text: string;
}

export type TriggerV13 = TextTriggerV13 | RollTriggerV13

export type EquationRecordV13 = Record<number, EquationV13>

export type SideEffectV13 = {
    id: number;
    condition: SideEffectConditionsTypeV13,
    values: number[],
    triggerId: number,
}

export type SideEffectsMapV13 = Record<number, SideEffectV13>

export type EquationV13 = {
    id: number;
    formula: string,
    nextSideEffectId: number,
    sideEffects?: SideEffectsMapV13
}

export type TagV13 = {
    id: number;
    color: string;
    name: string;
    buttonConfig: Partial<ButtonDataV13>
}

export type TriggersMapV13 = Record<number, TriggerV13>

export type ButtonDataV13 = {
    id: number;
    name: string;
    color: string;
    tag?: number;
    position: number;
    nextTriggerId: number;
    nextRollId: number;
    triggers: TriggersMapV13;
};

export type BaseButtonSetV13 = {
    version: string
}

export type ButtonSetV13 = BaseButtonSetV13 & {
    id: number;
    version: "1.3";
    name: string;
    tags: Record<number, TagV13>;
    buttonList: Record<number, ButtonDataV13>;
}

export type ButtonSetStateV13 = {
    nextSetId: number;
    nextButtonId: number;
    nextTagId: number;
    currentVersion: string;
    selectedSetId: number;
    sets: Record<number, ButtonSetV13>;
}

export const colorsV13 = [
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
export const GeneralTriggersV13 = {
    OnRoll: 0,
    None: -1,
}

export type SideEffectConditionsTypeV13 = "Always" | "Between" | "Not between" | "Equal to" | "Not equal to" | "Greater than" | "Less than" | "Greater than or equal to" | "Less than or equal to";

// String-valued enums are fine, but be consistent with naming
export const SideEffectConditionsV13: Record<string, SideEffectConditionsTypeV13> = {
    EqualTo: "Equal to",
    NotEqualTo: "Not equal to",
    GreaterThan: "Greater than",
    LessThan: "Less than",
    GreaterEqualTo: "Greater than or equal to",
    LessEqualTo: "Less than or equal to",
    Between: "Between",
    NotBetween: "Not between",
    Always: "Always"
}

// Fixed: PascalCase for enum name and members
export const TagIdsV13 = {
    Attack: 1,
    SavingThrow: 2,
    Check: 3
}
