import type {ButtonData, Tag} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../../store";
import useCheckboxSelection from "./useCheckboxSelection.tsx";
import {TagList} from "./TagList.tsx";
import {ButtonList} from "./ButtonList.tsx";

export function SetList() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const {
        checkedData,
        onCheckedSetChange
    } = useCheckboxSelection()

    return <ul className={"text-lg h-[50vh] overflow-y-auto border-2 border-gray-400 rounded-lg p-2 m-2"}>
        {buttonSets.map((buttonSet) => {
            if (buttonSet.buttonList.length === 0) return null;

            const isChecked = checkedData.sets.includes(buttonSet.id)
            const untaggedButtons = buttonSet.buttonList.filter(
                (button: ButtonData) => !button.tag || buttonSet.tags.map((tag: Tag) => tag.id).includes(button.tag) === false
            )

            return <div key={buttonSet.id} className={"pl-2 my-4 border-l-2 border-gray-400"}>
                <input type="checkbox" className={"mr-2"}
                       checked={isChecked}
                       onChange={() => onCheckedSetChange(buttonSet)}/>
                <label className={"text-xl font-bold"}>{buttonSet.name}</label>
                <TagList buttonSetId={buttonSet.id}/>
                <ButtonList buttonList={untaggedButtons} buttonSetId={buttonSet.id}/>
            </div>

        })}
    </ul>
}