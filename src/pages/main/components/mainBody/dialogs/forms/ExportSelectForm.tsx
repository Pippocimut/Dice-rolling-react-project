import {type ButtonData, useButtonList} from "../../../../../../data/buttonListDAO.ts";
import {useTags} from "../../../../../../data/tagsDAO.ts";
import {useState} from "react";

type Props = {
    close: () => void,
    exportAll: (tags: string[], buttons: string[]) => void,
}

export default function ExportSelectForm({close, exportAll}: Props) {
    const [buttonList] = useButtonList()
    const [tags] = useTags()

    const [checkedTags, setCheckedTags] = useState<string[]>([])
    const [checkedButtons, setCheckedButtons] = useState<string[]>([])

    const onCheckedTagsChange = (tag: string) => {
        if (checkedTags.includes(tag)) {
            setCheckedTags(checkedTags.filter((checkedTag) => checkedTag !== tag))
            setCheckedButtons(checkedButtons.filter((checkedButton) => checkedButton !== tag))
        } else {
            setCheckedTags([...checkedTags, tag])
            const buttonsToAdd = buttonList.filter((button: ButtonData) => button.tag === tag).map((button: ButtonData) => button.name)
            setCheckedButtons([...checkedButtons, ...buttonsToAdd])
        }
    }

    const onCheckedButtonsChange = (buttonName: string) => {
        if (checkedButtons.includes(buttonName)) {
            setCheckedButtons(checkedButtons.filter((checkedButton) => checkedButton !== buttonName))
            const buttonItem = buttonList.find((buttonI: ButtonData) => buttonI.name === buttonName)
            setCheckedTags(checkedTags.filter((checkedTag) => checkedTag !== buttonItem.tag))
        } else {
            setCheckedButtons([...checkedButtons, buttonName])
        }
    }

    return <div>
        <h1 className={"text-4xl font-bold mx-auto text-center my-2"}>
            Export
        </h1>
        <ul className={"text-lg"}>
            {tags.map((tag, index) => {
                return <div key={index} className={"pl-2 my-2"}>
                    <input type="checkbox" className={"mr-2"}
                           checked={checkedTags.includes(tag.name)}
                           onChange={() => onCheckedTagsChange(tag.name)}/>
                    <label>{tag.name}</label>
                    <div>
                        {buttonList.filter((button: ButtonData) => button.tag === tag.name).map((button: ButtonData) => {
                            return <div className={"flex flex-row pl-4"} key={button.name}>
                                <input type="checkbox" className={"mr-2"}
                                       onChange={() => onCheckedButtonsChange(button.name)}
                                       checked={button.tag ? checkedButtons.includes(button.name) : false}/>
                                <label>{button.name}</label>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </ul>
        <button className={"w-full mt-4"} onClick={() => {
            exportAll(checkedTags, checkedButtons);
            close()
        }}>
            Export
        </button>
    </div>
}