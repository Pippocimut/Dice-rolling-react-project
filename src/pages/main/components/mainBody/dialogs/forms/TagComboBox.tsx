import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";

type Props = {
    tag: string;
    setTag: (value: string) => void;
}

const TagComboBox = ({tag, setTag}: Props) => {

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)

    const tags = buttonSets.find((buttonSet) => buttonSet.id === selectedSetId)?.tags ?? []

    const handleTagChange = (value: string | null) => {
        setTag(value ?? "");
    };

    const filteredTags = tags.filter((tagI) => {
        const name = tagI.name.split("@")[1]
        if (!name || name === "") return true
        return tagI.name.toLowerCase().includes(name.toLowerCase())
    });

    return (
        <Combobox value={tag} onChange={handleTagChange}>
            <ComboboxInput
                placeholder={"Tag"}
                onChange={(e) => setTag("-1@" + e.target.value)}
                className={
                    "p-4 mx-4 my-auto border-2 border-gray-500 rounded-lg w-60 text-left max-h-10 align-middle"
                }
                displayValue={(tag: string) => tag || ""}
            />
            {!(filteredTags.length === 0 && tag !== "") && (
                <ComboboxOptions
                    className={
                        "text-text bg-background absolute z-10 top-18 overflow-auto text-base shadow-lg focus:outline-none sm:text-sm my-2 mx-4 border-2 border-borders rounded-lg w-60 text-left"
                    }
                >
                    {filteredTags.map((tag) => (
                        <ComboboxOption
                            value={`${tag.id}@${tag.name}`}
                            key={tag.name}
                            className={
                                "cursor-pointer w-full select-none py-2 px-4  text-text bg-background  hover:text-white hover:bg-secondary-background rounded-md"
                            }
                        >
                            {tag.name}
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            )}
        </Combobox>
    );
};

export default TagComboBox;
