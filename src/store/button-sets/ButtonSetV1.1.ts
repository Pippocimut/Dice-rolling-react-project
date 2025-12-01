export type RollV11 = {
    name: string;
    equation: string;
}

export type TagV11 = {
    id: number;
    color: string;
    name: string;
    rollsConfig: RollV11[],
}

export type ButtonDataV11 = {
    id: number;
    name: string;
    color: string;
    tag?: number;
    position: number;
    rolls: RollV11[];
};

export type BaseButtonSetV11 = {
    version: string
}

export type ButtonSetV11 = BaseButtonSetV11 & {
    id: number;
    version: "1.1";
    name: string;
    tags: Record<number, TagV11>;
    buttonList: Record<number, ButtonDataV11>;
}

/*
type ButtonSetStateV11 =  {
    nextSetId: number;
    nextButtonId: number;
    nextTagId: number;
    currentVersion: string;
    selectedSetId: number;
    sets: Record<number, ButtonSetV11>;
}

export const colorsV11 = [
    "red-roll-button",
    "orange-roll-button",
    "yellow-roll-button",
    "green-roll-button",
    "blue-roll-button",
    "purple-roll-button",
    "pink-roll-button",
    "gray-roll-button"
];*/
