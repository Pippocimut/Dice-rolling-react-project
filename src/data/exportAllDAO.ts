import {useButtonList} from "./buttonListDAO.ts";
import {useTags} from "./tagsDAO.ts";

export const useExportAll = () => {
    const [buttonList] = useButtonList();
    const [tags] = useTags();

    return {
        buttonList: buttonList,
        tags: tags,
    }
};
