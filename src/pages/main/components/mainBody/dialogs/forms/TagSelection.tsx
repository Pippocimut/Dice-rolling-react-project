import {useEffect, useState} from "react";
import TagComboBox from "./TagComboBox";
import type {Tag} from "../../../../../../store/button-sets/buttonSetSlice.ts";

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
    tag: Tag;
    setTag: (value: Tag) => void,
    buttonColor: string,
    setButtonColor: (value: string) => void,
};

const TagSelection = ({tag, setTag, buttonColor, setButtonColor}: Props) => {

    const [name, setName] = useState<string>(tag.name);
    const [id, setId] = useState<number>(tag.id);
    const [color, setColor] = useState<string>(buttonColor || tag.color);


    const setTagString = (tagString: string) => {
        const [id, name] = tagString.split("@");
        setId(parseInt(id));
        setName(name);
    }

    useEffect(() => {
        setTag({
            id: id,
            name: name,
            color: color,
        });
    }, [name, color, setTag]);

    return (
        <div className={"flex flex-row gap-2 relative"}>
            <TagComboBox tag={name} setTag={setTagString}/>
            <select
                className={"p-4 m-4 w-15 h-15 border-2 rounded-lg " + color}
                value={color}
                onChange={(e) => {
                    setColor(e.target.value)
                    setButtonColor(e.target.value)
                }}>
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
