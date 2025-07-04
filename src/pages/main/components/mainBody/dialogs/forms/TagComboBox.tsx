import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";

type Props = {
    selectedSet: string;
    tag: string;
    setTag: (value: string) => void;
}

const TagComboBox = ({tag, setTag, selectedSet}: Props) => {

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const tags = buttonSets.find((buttonSet) => buttonSet.name === selectedSet)?.tags ?? []

    const handleTagChange = (value: string | null) => {
        setTag(value ?? "");
    };

    const filteredTags = tags.filter((tagI) =>{
        return tagI.name.toLowerCase().includes(tag.toLowerCase())
    });

    return (
        <Combobox value={tag} onChange={handleTagChange}>
            <ComboboxInput
                placeholder={"Tag"}
                onChange={(e) => setTag("-1@"+e.target.value)}
                className={
                    "p-4 mx-4 my-auto border-2 border-gray-500 rounded-lg w-60 text-left max-h-10 align-middle"
                }
                displayValue={(tag: string) => tag || ""}
            />
            {!(filteredTags.length === 0 && tag !== "") && (
                <ComboboxOptions
                    className={
                        "absolute z-10 top-18 overflow-auto text-base shadow-lg ring-1 bg-neutral-800 ring-black ring-opacity-5 focus:outline-none sm:text-sm my-2 mx-4 border-2 border-gray-500 rounded-lg w-60 text-left"
                    }
                >
                    {filteredTags.map((tag) => (
                        <ComboboxOption
                            value={`${tag.id}@${tag.name}`}
                            key={tag.name}
                            className={
                                "cursor-pointer w-full select-none py-2 px-4  bg-neutral-800 hover:text-white hover:bg-neutral-500 rounded-md"
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
