import {useButtonList} from "./buttonListDAO.ts";
import {useTags} from "./tagsDAO.ts";

export const useExportAll = () => {
    const [buttonList] = useButtonList();
    const [tags] = useTags();

    const updateAll = () => {
        throw new Error("Not implemented");
    }

    return [{
        buttonList: buttonList,
        tags: tags,
    }, updateAll]
};
