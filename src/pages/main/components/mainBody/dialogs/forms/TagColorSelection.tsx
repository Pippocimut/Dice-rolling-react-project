import {colors} from "@/pages/main/components/mainBody/dialogs/forms/TagSelection.tsx";
import {useState} from "react";

type Props = {
    buttonColor: string,
    setButtonColor: (value: string) => void,
}

export function TagColorSelection(props: Props) {
    const [color, setColor] = useState<string>(props.buttonColor);

    return <select
        className={"p-4 m-4 w-15 h-15 border-2 rounded-lg " + color}
        value={color}
        onChange={(e) => {
            setColor(e.target.value)
            props.setButtonColor(e.target.value)
        }}>
        {colors.map((color) => (
            <option
                value={color}
                key={color}
                className={"w-2 h-2 " + color}
            ></option>
        ))}
    </select>
}