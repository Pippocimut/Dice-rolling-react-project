import TagComboBox from "./TagComboBox";
import {TagColorSelection} from "@/pages/main/components/mainBody/dialogs/forms/TagColorSelection.tsx";

export const colors = [
    "red-roll-button",
    "orange-roll-button",
    "yellow-roll-button",
    "green-roll-button",
    "blue-roll-button",
    "purple-roll-button",
    "pink-roll-button",
    "gray-roll-button"
];

type Props = {
    tag: number;
    setTag: (value: number) => void,
    buttonColor: string,
    setButtonColor: (value: string) => void,
};

const TagSelection = ({tag, setTag, buttonColor, setButtonColor}: Props) => {
    return (
        <div className={"flex flex-row items-center justify-center gap-2 relative"}>
            <TagComboBox tag={tag} setTag={setTag}/>
            <TagColorSelection setButtonColor={setButtonColor} buttonColor={buttonColor}/>
        </div>
    );
};

export default TagSelection;
