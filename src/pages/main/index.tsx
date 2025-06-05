import {RollButton} from "./components/RollButton";
import {useState} from "react";
import {ButtonCreatePopup} from "./components/ButtonCreatePopup";
import {Index} from "./components/CreateDialog";
import {type ButtonData, useButtonList} from "../../data/buttonListDAO.ts";
import Sidebar from "./components/Sidebar.tsx";
import {type Tag, useTags} from "../../data/tagsDAO.ts";

export function Main() {
    const [buttonList, updateButtonList] = useButtonList()
    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false)
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
    const [tags, updateTags] = useTags()
    const [selectedTag, setSelectedTag] = useState<Tag>()

    const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null)

    const removeButton = (index: number) => {
        updateButtonList(buttonList.filter((_: object, i: number) => i !== index))
        setIsOpenEditDialog(false)
        setSelectedButtonIndex(null)
    }

    const editButton = (index: number) => {
        setSelectedButtonIndex(index)
        setIsOpenEditDialog(true)
    }

    return (
        <div className={"flex flex-row h-screen w-full justify-start items-start"}>
            <Sidebar>
                {tags.map(tag => {
                    if (tag.name !== "") {
                        return (<button className={"w-full rounded-lg my-1 p-4 "+tag.color+ " "+ (selectedTag?.name == tag.name? " outline-4": " outline-none")}
                        onClick={() => {
                            if(selectedTag && selectedTag.name == tag.name){
                                setSelectedTag(undefined)
                            } else {
                                setSelectedTag(tag)
                            }
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            if(tags.length <= 1){
                                setSelectedTag(undefined)
                            }
                            updateTags(tags.filter(tagI=> tagI.name != tag.name))
                        }}
                        >
                            {tag.name}
                        </button>)
                    }
                    return null
                })
                }
            </Sidebar>
            <div className={"flex flex-col h-full gap-20 w-full items-center justify-around"}>

                <ul id="buttons"
                    className={"flex flex-row flex-wrap gap-2 m-4 p-4 w-full justify-center items-center h-fit"}>
                    {buttonList && buttonList.map((buttonData: ButtonData, index: number) => {
                        if (selectedTag && buttonData.tag !== selectedTag.name) {
                            return null
                        }
                        return (<div className={"flex flex-row"} key={index}>
                            <RollButton rolls={buttonData.rolls} name={buttonData.name}
                                        deleteButton={() => removeButton(index)}
                                        editButton={() => editButton(index)}
                                        color={buttonData.color}
                                        key={index}/>
                        </div>)
                    })}
                    <button className={"w-30 h-30 flex items-center justify-center bg-neutral-900 hover:outline-2 rounded-lg"}
                            onClick={() => setIsOpenCreateDialog(true)}>
                        <span className={"text-6xl pb-3"}>✚</span>
                    </button>
                </ul>

                {isOpenCreateDialog && (
                    <Index isOpen={isOpenCreateDialog} onClose={() => setIsOpenCreateDialog(false)}>
                        <ButtonCreatePopup function={"create"} onClose={() => setIsOpenCreateDialog(false)} tag={selectedTag}/>
                    </Index>
                )}
                {isOpenEditDialog && selectedButtonIndex !== null ? (
                    <Index isOpen={isOpenEditDialog} onClose={() => setIsOpenEditDialog(false)}>
                        <ButtonCreatePopup function={"edit"} button={buttonList[selectedButtonIndex]}
                                           deleteButton={() => removeButton(selectedButtonIndex)}
                                           onClose={() => setIsOpenEditDialog(false)}/>
                    </Index>
                ) : null}
            </div>
        </div>)
}