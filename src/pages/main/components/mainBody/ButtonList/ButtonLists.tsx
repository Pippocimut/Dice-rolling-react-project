import {useSelector} from "react-redux";
import {useMemo} from "react";
import ButtonListSection from "./ButtonListSection.tsx";
import {getSelectedSet, getSortedTags} from "@/pages/main/components/mainBody/utils.ts";

export default function ButtonLists() {
    const buttonSet = useSelector(getSelectedSet)!;

    const sortedTags = useMemo(() => {
        if (!buttonSet) return [];
        return getSortedTags(buttonSet);
    }, [buttonSet]);

    return (
        <div className="flex flex-col w-fit max-w-2/3 my-2 justify-center items-center">
            <ButtonListSection/>
            <div className="flex flex-row flex-wrap w-fit gap-x-8 justify-center items-center">
                {sortedTags.map((tag) => <ButtonListSection key={tag.id} tagId={tag.id}/>)}
            </div>
        </div>
    );
};