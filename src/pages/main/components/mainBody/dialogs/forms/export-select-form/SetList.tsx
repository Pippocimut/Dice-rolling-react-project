import type {ButtonData} from "@/store/button-sets/buttonSetSlice.ts";
import {TagList} from "./TagList.tsx";
import {ButtonList} from "./ButtonList.tsx";
import type {RootState} from "@/store";
import {useSelector} from "react-redux";
import useCheckboxSelection
    from "@/pages/main/components/mainBody/dialogs/forms/export-select-form/useCheckboxSelection.tsx";

export function SetList() {

    const buttonSets = useSelector((state:RootState) => state.buttonSet.sets)

    const {
        checkedData,
        onCheckedSetChange
    } = useCheckboxSelection()

    return <ul className={"text-lg h-[50vh] overflow-y-auto border-2 border-gray-400 rounded-lg p-2 m-2"}>
        {Object.values(buttonSets).map((buttonSet) => {
            if (Object.values(buttonSet.buttonList).length === 0) return null;

            const isChecked = checkedData.sets.includes(buttonSet.id)
            const untaggedButtons = Object.values(buttonSet.buttonList).filter(
                (button: ButtonData) => !button.tag || !(buttonSet.tags[button.tag])
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