import type {ButtonData} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import useCheckboxSelection from "./useCheckboxSelection.tsx";
import {ButtonList} from "./ButtonList.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../../store";

type Props = {
    buttonSetId: number;
}

export function TagList({buttonSetId}: Props) {

    const {
        checkedData,
        onCheckedTagsChange
    } = useCheckboxSelection()

    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find((buttonSet) => buttonSet.id === buttonSetId))
    if (!buttonSet) {
        throw new Error("Button set not found")
    }

    return buttonSet.tags.map((tag) => {
        const currentSetTags = checkedData.tags[buttonSetId] ?? []
        const isChecked = currentSetTags.includes(tag.id)
        const onChangedTag = onCheckedTagsChange(buttonSetId)

        const buttonList = buttonSet.buttonList.filter((button: ButtonData) => button.tag === tag.id)

        return <div key={tag.id} className={"pl-2 my-2"}>
            <input type="checkbox" className={"mr-2"} checked={isChecked}
                   onChange={() => onChangedTag(tag)}/>
            <label className={"text-xl font-bold"}>{tag.name}</label>
            <ButtonList buttonList={buttonList} buttonSetId={buttonSetId}/>
        </div>

    })
}
