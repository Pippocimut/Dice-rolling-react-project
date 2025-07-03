import {useEffect, useState} from "react";
import TagComboBox from "./TagComboBox";
import type {Tag} from "../../../../../../store/buttonSets/buttonSetSlice.ts";

export const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-gray-500",
    "bg-indigo-500",
];

type Props = {
    selectedSet: string
    tag: Tag;
    setTag: (value: Tag) => void,
};

const TagSelection = ({tag, setTag, selectedSet}: Props) => {

    const [name, setName] = useState<string>(tag.name);
    const [color, setColor] = useState<string>(tag.color);

    useEffect(() => {
        setName(tag.name);
        setColor(tag.color);
    }, [tag]);

    useEffect(() => {
        setTag({
            name: name,
            color: color,
        });
    }, [name, color, setTag]);

    return (
        <div className={"flex flex-row gap-2 relative"}>
            <TagComboBox tag={name} setTag={setName} selectedSet={selectedSet}/>
            <select
                className={"p-4 m-4 w-15 h-15 border-2 rounded-lg " + color}
                value={color}
                onChange={(e) => setColor(e.target.value)}
            >
                {colors.map((color) => (
                    <option
                        value={color}
                        key={color}
                        className={"w-2 h-2 " + color}
                    ></option>
                ))}
            </select>
        </div>
    );
};

export default TagSelection;
