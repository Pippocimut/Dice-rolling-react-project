import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from "@headlessui/react";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";

type Props = {
    set: string,
    setSet: (value: string) => void;
}

const TagComboBox = ({set, setSet}: Props) => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const setsList = Object.values(buttonSets).map((buttonSet) => buttonSet.name)

    const handleSetChange = (value: string | null) => {
        setSet(value ?? "");
    };

    const filteredSets = setsList.filter((setI) =>
        setI.toLowerCase().includes(set.toLowerCase())
    );

    return (
        <Combobox value={set} onChange={handleSetChange}>
            <ComboboxInput
                placeholder={"Tag"}
                onChange={(e) => setSet(e.target.value)}
                className={
                    "p-4 mx-4 my-auto border-2 border-gray-500 rounded-lg w-60 text-left max-h-10 align-middle"
                }
                displayValue={(tag: string) => tag || ""}
            />
            {!(filteredSets.length === 0 && set !== "") && (
                <ComboboxOptions
                    className={
                        " overflow-auto text-base shadow-lg ring-1 bg-neutral-800 ring-black ring-opacity-5 focus:outline-none sm:text-sm my-2 mx-4 border-2 border-gray-500 rounded-lg w-60 text-left"
                    }
                >
                    {filteredSets.map((set) => (
                        <ComboboxOption
                            value={set}
                            key={set}
                            className={
                                "cursor-pointer w-full select-none py-2 px-4  bg-neutral-800 hover:text-white hover:bg-neutral-500 rounded-md"
                            }
                        >
                            {set}
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            )}
        </Combobox>
    );
};

export default TagComboBox;
