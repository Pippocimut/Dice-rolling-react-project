import {type ButtonData, useButtonList} from "./buttonListDAO.ts";
import {type Tag, useTags} from "./tagsDAO.ts";
import {useCallback} from "react";

export type importType = {
    buttonList: ButtonData[],
    tags: Tag[],
}

export const useImportAll = () => {
    const [buttonList, updateButtonList] = useButtonList();
    const [tags, updateTags] = useTags();

    return useCallback((data: importType) => {
        
        updateButtonList([
            ...buttonList,
            ...data.buttonList,
        ]);

        updateTags([
            ...tags,
            ...data.tags.filter(tag => !tags.some(t => t.name === tag.name)),
        ]);
    }, [buttonList, tags])
};
