import {
    type Tag,
    type TriggersMap,
} from "@/store/button-sets/buttonSetSlice.ts";
import { SideEffectConditionsV12, TagIdsV12 } from "./ButtonSetV1.2";

const attackTriggers: TriggersMap = {
    [1]: {
        "name": "Attack",
        onRoll: true,
        type: "roll",
        id: 1,
        isNotComplete: true,
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
                        "target": 2
                    },
                    [2]: {
                        "id": 2,
                        "condition": SideEffectConditionsV12.Between,
                        "values": [2, 19],
                        "target": 3
                    },
                    [3]: {
                        "id": 3,
                        "condition": SideEffectConditionsV12.EqualTo,
                        "values": [1],
                        "target": 4
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
        onRoll: false,
        isNotComplete: true,
        type: "roll",
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
        onRoll: false,
        isNotComplete: true,
        type: "roll",
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
        isNotComplete: true,
        onRoll: false,
        type: "text",
        id: 4,
        text: "Missed!"
    }
}


const saveTriggers: TriggersMap = {
    [1]: {
        "name": "Save",
        onRoll: true,
        type: "roll",
        isNotComplete: true,
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


const checkTriggers: TriggersMap = {
    [1]: {
        "name": "Check",
        id: 1,
        isNotComplete: true,
        onRoll: true,
        type: "roll",
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
        triggers: { ...checkTriggers },
        nextTriggerId: 1,
    }
}

export const attackTag: Tag = {
    id: TagIdsV12.Attack,
    name: "attack",
    color: "red-roll-button",
    buttonConfig: {
        triggers: { ...attackTriggers },
        nextTriggerId: 4,
    }
}

export const saveTag: Tag = {
    id: TagIdsV12.SavingThrow,
    name: "saving throw",
    color: "blue-roll-button",
    buttonConfig: {
        triggers: { ...saveTriggers },
        nextTriggerId: 1,
    }
}

export const defaultTags: Record<number, Tag> = {
    [TagIdsV12.Check]: checkTag,
    [TagIdsV12.Attack]: attackTag,
    [TagIdsV12.SavingThrow]: saveTag
}