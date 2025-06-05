import {useCookies} from "react-cookie";

export type Tag = {
    name: string,
    color: string,
}

export function useTags(): [Tag[], (tags: Tag[]) => void] {
    const {0: cookies, 1: setCookie} = useCookies(["tags"]);

    if (!cookies.tags) {
        setCookie("tags", []);
    }

    const updateTagList = (tags: Tag[]) => {
        setCookie("tags", tags);
    };


    return [!cookies.tags ? [] : cookies.tags, updateTagList];
}
