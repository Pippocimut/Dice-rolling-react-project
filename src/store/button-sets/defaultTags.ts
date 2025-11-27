import {
    type RollMap,
    type Tag,
    type Trigger
} from "@/store/button-sets/buttonSetSlice.ts";
import {GeneralTriggersV12, SideEffectConditionsV12, TagIdsV12} from "./ButtonSetV1.2";

export const defaultTriggers: Record<number, Trigger> = {
    [GeneralTriggersV12.OnRoll]: {
        id: GeneralTriggersV12.OnRoll,
        name: "On roll"
    },
    [GeneralTriggersV12.None]: {
        id: -1,
        name: "None"
    }
}

const checkTriggers = {
    ...defaultTriggers,
}

const attackTriggers = {
    ...defaultTriggers,
}

const saveTriggers = {
    ...defaultTriggers,
}

const attackRolls: RollMap = {
    [1]: {
        "name": "Attack",
        "trigger": 0,
        id: 1,
        "nextEquationId": 3,
        "equations": {
            [1]: {
                "id": 1,
                "formula": "1d20",
                "nextSideEffectId": 4,
                "sideEffects": {
                    [1]: {
                        "id": 1,
                        "condition": SideEffectConditionsV12.EqualTo,
                        "values": [20],
                        "triggerId": 2
                    },
                    [2]: {
                        "id": 2,
                        "condition": SideEffectConditionsV12.Between,
                        "values": [2, 19],
                        "triggerId": 3
                    },
                    [3]: {
                        "id": 3,
                        "condition": SideEffectConditionsV12.EqualTo,
                        "values": [1],
                        "triggerId": 4
                    }
                }
            },
            [2]: {
                "id": 2,
                "formula": "6",
                "nextSideEffectId": 1,
            }
        }
    },
    [2]: {
        "name": "Critical hit",
        "trigger": 1,
        id: 2,
        "nextEquationId": 2,
        "equations": {
            [1]: {
                "id": 1,
                "formula": "2d6+3",
                "nextSideEffectId": 1,
            }
        }
    },
    [3]: {
        "name": "Hit",
        "trigger": 2,
        id: 3,
        "nextEquationId": 2,
        "equations": {
            [1]: {
                "id": 1,
                "formula": "1d6+3",
                "nextSideEffectId": 1,
            }
        }
    },
    [4]: {
        "name": "Miss",
        "trigger": 3,
        id: 4,
        "nextEquationId": 1,
        "equations": {}
    }
}


const saveRolls: RollMap = {
    [1]: {
        "name": "Save",
        "trigger": 0,
        id: 1,
        "nextEquationId": 2,
        "equations": {
            [1]: {
                "id": 1,
                "formula": "1d20",
                "nextSideEffectId": 1,
                "sideEffects": {}
            },
        }
    }
}


const checkRolls: RollMap = {
    [1]: {
        "name": "Check",
        "trigger": 0,
        id: 1,
        "nextEquationId": 2,
        "equations": {
            [1]: {
                "id": 1,
                "formula": "1d20",
                "nextSideEffectId": 1,
                "sideEffects": {}
            },
        }
    }
}


export const checkTag: Tag = {
    id: TagIdsV12.Check,
    name: "check",
    color: "green-roll-button",
    buttonConfig: {
        triggers: {...checkTriggers, ...checkRolls},
        nextTriggerId: 1,
        rolls: checkRolls
    }
}

export const attackTag: Tag = {
    id: TagIdsV12.Attack,
    name: "attack",
    color: "red-roll-button",
    buttonConfig: {
        triggers: {...attackTriggers,...attackRolls},
        nextTriggerId: 4,
        rolls: attackRolls
    }
}

export const saveTag: Tag = {
    id: TagIdsV12.SavingThrow,
    name: "saving throw",
    color: "blue-roll-button",
    buttonConfig: {
        triggers: {...saveTriggers, ...saveRolls},
        nextTriggerId: 1,
        rolls: saveRolls
    }
}

export const defaultTags: Record<number, Tag> = {
    [TagIdsV12.Check]: checkTag,
    [TagIdsV12.Attack]: attackTag,
    [TagIdsV12.SavingThrow]: saveTag
}