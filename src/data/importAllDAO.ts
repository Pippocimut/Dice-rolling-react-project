import {useCallback} from "react";

import {useSelector} from "react-redux";
import type {RootState} from "../store"; // Adjust the import path as needed
import {updateButtonSets, type ButtonSet, type ButtonData, type Tag} from "../store/buttonSets/buttonSetSlice.ts";

export type importType = {
    sets: ButtonSet[]
}

export const useImportAll = () => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    return useCallback((data: importType) => {

        //TODO: Make it so there is only 1 update at the end of the loop and not multiple inside the loop
        for (const set of data.sets) {
            set.tags = set.buttonList.map((button: ButtonData) => {
                if (!button.tag) return;
                return {
                    name: button.tag,
                    color: button.color,
                }
            }).filter(tag => tag !== undefined)
                .reduce((acc: Tag[], curr: Tag) => {
                    if (!curr) return acc;
                    if (acc.some(t => t.name === curr.name)) {
                        return acc;
                    }
                    return [...acc, curr];
                }, [])

            updateButtonSets([...buttonSets, set]);
        }

    }, [buttonSets])
};
