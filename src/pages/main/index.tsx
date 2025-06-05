import {RollButton} from "./components/RollButton";
import {useState} from "react";
import {ButtonCreatePopup} from "./components/ButtonCreatePopup";
import {Index} from "./components/CreateDialog";
import {type ButtonData, useButtonList} from "../../data/buttonListDAO.ts";

export function Main() {
    const [buttonList, updateButtonList] = useButtonList()
    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false)
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)

    const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null)


    const removeButton = (index: number) => {
        updateButtonList(buttonList.filter((_: object, i: number) => i !== index))
    }

    const editButton = (index: number) => {
        setSelectedButtonIndex(index)
        setIsOpenEditDialog(true)
    }

    return (<div className={"flex flex-col h-full gap-20 items-center justify-around"}>
        <div>
            <ul id="buttons"
                className={"flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"}>
                {buttonList && buttonList.map((buttonData: ButtonData, index: number) => {
                    return (<div className={"flex flex-row"} key={index}>
                        <RollButton rolls={buttonData.rolls} name={buttonData.name}
                                    deleteButton={() => removeButton(index)}
                                    editButton={() => editButton(index)}
                                    color={buttonData.color}
                                    key={index}/>
                    </div>)
                })}
                <button className={"w-50 h-50 flex items-center justify-center bg-neutral-900"}
                        onClick={() => setIsOpenCreateDialog(true)}>
                    <span className={"text-6xl pb-3"}>✚</span>
                </button>
            </ul>
        </div>
        {isOpenCreateDialog && (
            <Index isOpen={isOpenCreateDialog} onClose={() => setIsOpenCreateDialog(false)}>
                <ButtonCreatePopup function={"create"} onClose={() => setIsOpenCreateDialog(false)}/>
            </Index>
        )}
        {isOpenEditDialog && selectedButtonIndex !== null ? (
            <Index isOpen={isOpenEditDialog} onClose={() => setIsOpenEditDialog(false)}>
                <ButtonCreatePopup function={"edit"} button={buttonList[selectedButtonIndex]}
                                   onClose={() => setIsOpenEditDialog(false)}/>
            </Index>
        ) : null}
    </div>)
}