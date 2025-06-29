import {useButtonList} from "./buttonListDAO.ts";
import {useTags} from "./tagsDAO.ts";

export const useExportAll = () => {
    const [buttonList] = useButtonList();
    const [tags] = useTags();

    return {
        sets: [{
            name: "All" + Math.random().toString(36).substring(7),
            data: {
                buttonList: buttonList,
                tags: tags,
            }
        }]
    }
};
