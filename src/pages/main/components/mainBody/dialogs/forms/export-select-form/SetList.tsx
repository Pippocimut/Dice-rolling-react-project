import type {ButtonData, Tag} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../../store";
import useCheckboxSelection from "./useCheckboxSelection.tsx";

export function SetList() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const {
        checkedData,
        onCheckedTagsChange,
        onCheckedButtonsChange,
        onCheckedSetChange
    } = useCheckboxSelection()


    return <ul className={"text-lg h-[50vh] overflow-y-auto border-2 border-gray-400 rounded-lg p-2 m-2"}>
        {buttonSets.map((buttonSet, index) => {
            if (buttonSet.buttonList.length === 0) {
                return null;
            }

            const isChecked = checkedData.sets.includes(buttonSet.name)

            return <div key={index} className={"pl-2 my-4 border-l-2 border-gray-400"}>
                <input type="checkbox" className={"mr-2"}
                       checked={isChecked}
                       onChange={() => onCheckedSetChange(buttonSet)}/>
                <label className={"text-xl font-bold"}>{buttonSet.name}</label>

                {buttonSet.tags.map((tag, index) => {
                    const currentSetTags = checkedData.tags[buttonSet.name] ?? []
                    const isChecked = currentSetTags.includes(tag.name)
                    const onChangenTag = onCheckedTagsChange(buttonSet.name)

                    const buttonList = buttonSet.buttonList.filter((button: ButtonData) => button.tag === tag.id)

                    return <div key={index} className={"pl-2 my-2"}>
                        <input type="checkbox" className={"mr-2"} checked={isChecked}
                               onChange={() => onChangenTag(tag)}/>
                        <label className={"text-xl font-bold"}>{tag.name}</label>

                        {buttonList.map((button: ButtonData, index: number) => {
                            const currentSetButtons = checkedData.buttons[buttonSet.name] ?? []
                            const isChecked = currentSetButtons.includes(button.name)
                            const onChangedButton = onCheckedButtonsChange(buttonSet.name)

                            return <div className={"flex flex-row pl-4"} key={index}>
                                <input type="checkbox" className={"mr-2"}
                                       checked={isChecked}
                                       onChange={() => onChangedButton(button)}
                                />
                                <label>{button.name}</label>
                            </div>
                        })}
                    </div>
                })}
                {buttonSet.buttonList.filter(
                    (button: ButtonData) => !button.tag || buttonSet.tags.map((tag: Tag) => tag.id).includes(button.tag) === false
                ).map((button: ButtonData, index: number) => {
                    return <div key={index} className={"pl-2 my-2 border-l-2 border-gray-400"}>
                        <input type="checkbox" className={"mr-2"}
                               checked={checkedData.buttons[buttonSet.name]?.includes(button.name) ?? false}
                               onChange={() => onCheckedButtonsChange(buttonSet.name)(button)}
                        />
                        <label className={"text-xl font-bold"}>{button.name}</label>
                    </div>
                })}
            </div>

        })}
    </ul>
}