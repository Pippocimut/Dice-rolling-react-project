import type {ButtonDataV11, ButtonSetV11, RollV11, TagV11} from "@/store/button-sets/ButtonSetV1.1.ts";
import {
    type ButtonDataV12,
    type ButtonSetV12,
    GeneralTriggersV12,
    type RollMapV12,
    type RollV12,
    type TagV12
} from "@/store/button-sets/ButtonSetV1.2.ts";
import {defaultTriggers} from "@/store/button-sets/defaultTags.ts";

type UsableDataSets = ButtonSetV11 | ButtonSetV12

const latestVersion: string = "1.2";

export class ImportManager {

    private fromVersion: string | null = null;
    private toVersion: string | null = null;

    private data: UsableDataSets | null = null

    public from(data: UsableDataSets) {
        this.fromVersion = data.version;
        this.data = data;
    }

    public to(version: string) {
        this.toVersion = version;
    }

    public convert() {
        if (!this.data) throw new Error(
            "No data to convert. Call from() before convert()"
        )
        if (!this.fromVersion) throw new Error()
        if (!this.toVersion) this.toVersion = latestVersion

        if (this.fromVersion === this.toVersion) return this.data

        switch (this.fromVersion) {
            case "1.1":
                switch (this.toVersion) {
                    case "1.2":
                        return convertV11ToLatest(this.data as ButtonSetV11)
                }
        }

        return this.data
    }
}

const convertV11ToLatest = (data: ButtonSetV11) => {
    return {
        id: data.id,
        version: latestVersion as "1.2",
        name: data.name,
        tags: {
            ...Object.entries(data.tags as Record<number, TagV11>).reduce((acc, [key, value]) => {
                acc[parseInt(key)] = {
                    id: value.id,
                    name: value.name,
                    color: value.color,
                    buttonConfig: {
                        rolls: convertRolls(value.rollsConfig)
                    }
                }
                return acc
            }, {} as Record<number, TagV12>)
        },
        buttonList: {
            ...Object.values(data.buttonList as Record<number, ButtonDataV11>).reduce((acc, curr) => {

                const rolls: RollMapV12 = convertRolls(curr.rolls)

                acc[curr.id] = {
                    ...curr,
                    rolls: rolls,
                    nextTriggerId: curr.rolls.length,
                    nextRollId: curr.rolls.length,
                    triggers: {
                        ...defaultTriggers,
                        ...rolls
                    }
                }
                return acc
            }, {} as Record<number, ButtonDataV12>)
        }
    } as ButtonSetV12
}

const convertRolls = (rolls: RollV11[]) => {
    return rolls.reduce((acc, roll, index) => {
        acc[index] = {
            ...roll,
            equations: {
                [1]: {
                    id:1,
                    formula: roll.equation,
                    nextSideEffectId: 1,
                    sideEffects: {}
                }
            },
            trigger: GeneralTriggersV12.OnRoll,
            nextEquationId: 2,
            id: index
        } as RollV12
        return acc
    }, {} as RollMapV12)
}