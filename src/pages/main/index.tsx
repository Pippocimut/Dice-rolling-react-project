import {RollButton} from "./components/RollButton";
import {useCookies} from "react-cookie";
import {useState} from "react";
import type {Roll} from "./types.ts";
import {ButtonCreatePopup} from "./components/ButtonCreatePopup";
import {CreateButtonDialog} from "./components/CreateButtonDialog.tsx";

export function Main() {
    const {0: cookie, 1: setCookie} = useCookies(["buttonList"])
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const buttonList = cookie.buttonList || []

    const removeButton = (index: number) => {
        const newButtonList = [...buttonList]
        newButtonList.splice(index, 1)
        setCookie("buttonList", newButtonList)
    }

    return (<div className={"flex flex-col h-full gap-20 items-center justify-around"}>
        <div>
            <ul id="buttons"
                className={"flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"}>
                {buttonList.map((buttonData: {
                    name: string,
                    rolls: Roll[],
                    color:string
                }, index: number) => {
                    return (<div className={"flex flex-row"}>
                        <RollButton rolls={buttonData.rolls} name={buttonData.name}
                                    deleteButton={() => removeButton(index)}
                                    color={buttonData.color}
                                    key={index}/>
                    </div>)
                })}
                <button className={"w-50 h-50 flex items-center justify-center bg-neutral-900"} onClick={() => setIsOpenDialog(true)}>
                    <span className={"text-6xl pb-3"}>✚</span>
                </button>
            </ul>
        </div>
        {isOpenDialog && (
            <CreateButtonDialog isOpen={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
                <ButtonCreatePopup buttonList={buttonList} onClose={() => setIsOpenDialog(false)}/>
            </CreateButtonDialog>
        )}

    </div>)
}