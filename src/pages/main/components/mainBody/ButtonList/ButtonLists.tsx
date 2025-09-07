import {useSelector} from "react-redux";
import {useMemo} from "react";
import ButtonListSection from "./ButtonListSection.tsx";
import { getSortedTags} from "@/pages/main/components/mainBody/utils.ts";
import UntaggedButtonListSection from "@/pages/main/components/mainBody/ButtonList/UntaggedButtonListSection.tsx";
import type {RootState} from "@/store";

export default function ButtonLists() {
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets[ state.buttonSet.selectedSetId])!;

    const sortedTags = useMemo(() => {
        if (!buttonSet) return [];
        return getSortedTags(buttonSet);
    }, [buttonSet]);

    return (
        <div className="flex flex-col w-fit max-w-2/3 my-2 justify-center items-center">
            <UntaggedButtonListSection/>
            <div className="flex flex-row flex-wrap w-fit gap-x-8 justify-center items-center">
                {sortedTags.map((tag) => <ButtonListSection key={tag.id} tagId={tag.id}/>)}
            </div>
        </div>
    );
};