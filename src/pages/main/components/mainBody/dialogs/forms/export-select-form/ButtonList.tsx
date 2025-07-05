import type {ButtonData} from "../../../../../../../store/button-sets/buttonSetSlice.ts";
import useCheckboxSelection from "./useCheckboxSelection.tsx";

type Props = {
    buttonList: ButtonData[];
    buttonSetId: number;
}

export function ButtonList({buttonList, buttonSetId}: Props) {
    const {
        checkedData,
        onCheckedButtonsChange
    } = useCheckboxSelection()

    return buttonList.map((button: ButtonData) => {
            const currentSetButtons = checkedData.buttons[buttonSetId] ?? []
            const isChecked = currentSetButtons.includes(button.id)
            const onChangedButton = onCheckedButtonsChange(buttonSetId)

            return <div className={"flex flex-row pl-4"} key={button.id}>
                <input type="checkbox" className={"mr-2"}
                       checked={isChecked}
                       onChange={() => onChangedButton(button)}
                />
                <label>{button.name}</label>
            </div>
        })
}
