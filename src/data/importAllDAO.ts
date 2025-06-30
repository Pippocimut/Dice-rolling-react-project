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

            const setTags = set.data.tags.filter(tag => !tags.some(t => t.name === tag.name))

            const buttonTags = set.data.buttonList.map((button: ButtonData) => {
                if (!button.tag) return;
                return {
                    name: button.tag,
                    color: button.color,
                }
            }).filter(tag => tag !== undefined)
                .filter(tag => !tags.some(t => t.name === tag.name))
                .reduce((acc: Tag[], curr: Tag) => {
                    if (!curr) return acc;
                    if (acc.some(t => t.name === curr.name)) {
                        return acc;
                    }
                    return [...acc, curr];
                }, [])

            console.log(buttonTags);


            const mergedTags = [...setTags, ...buttonTags.filter(tag => !setTags.some(t => t.name === tag.name))];

            newTags.push(...mergedTags);

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
