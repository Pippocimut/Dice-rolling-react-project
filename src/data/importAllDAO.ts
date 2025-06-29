import {type ButtonData, useButtonList} from "./buttonListDAO.ts";
import {type Tag, useTags} from "./tagsDAO.ts";
import {useCallback} from "react";

export type importType = {
    sets: {
        name: string,
        data: {
            buttonList: ButtonData[],
            tags: Tag[],
        }
    }[]
}

export const useImportAll = () => {
    const [buttonList, updateButtonList] = useButtonList();
    const [tags, updateTags] = useTags();

    return useCallback((data: importType) => {

        const newButtonList: ButtonData[] = [];
        const newTags: Tag[] = [];

        for (const set of data.sets) {
            newButtonList.push(...set.data.buttonList.filter(button => !buttonList.some((b: ButtonData) => b.name === button.name)));
            newTags.push(...set.data.tags.filter(tag => !tags.some(t => t.name === tag.name)));
        }

        updateButtonList([
            ...buttonList,
            ...newButtonList,
        ]);

        updateTags([
            ...tags,
            ...newTags,
        ]);

    }, [buttonList, tags])
};
