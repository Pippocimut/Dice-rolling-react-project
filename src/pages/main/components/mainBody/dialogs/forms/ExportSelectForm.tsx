import {useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";
import type {ButtonData, ButtonSet, Tag} from "../../../../../../store/buttonSets/buttonSetSlice.ts";

type Props = {
    close: () => void,
    exportAll: (tags: string[], buttons: string[], setName: string) => void,
}

export default function ExportSelectForm({close, exportAll}: Props) {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const [checkedData, setCheckedData] = useState<{
        sets: string[],
        tags: string[],
        buttons: string[],
    }>({sets: [], tags: [], buttons: []})

    const [setName, setSetName] = useState("")
    const [selectAll, setSelectAll] = useState(false)

    const onCheckedSetChange = (newSet: ButtonSet) => {
        if (checkedData.sets.includes(newSet.name)) {
            setCheckedData({
                ...checkedData,
                sets: checkedData.sets.filter((checkedSet) => checkedSet !== newSet.name),
            })
        } else {
            setCheckedData({
                ...checkedData,
                sets: [...checkedData.sets, newSet.name],
                tags: [...checkedData.tags, ...newSet.tags.map(tag => tag.name)],
                buttons: [...checkedData.buttons, ...newSet.buttonList.map(button => button.name)],
            })
        }
    }

    const onCheckedTagsChange = (setName: string) => (newTag: Tag) => {

        if (checkedData.tags.includes(newTag.name)) {
            const newCheckedData = checkedData.tags.filter((checkedTag) => checkedTag !== newTag.name)
            const removeSet = checkedData.sets.filter((checkedSet) => checkedSet != setName)
            setCheckedData({
                ...checkedData,
                sets: removeSet,
                tags: newCheckedData,
            })
        } else {
            setCheckedData({
                ...checkedData,
                tags: [...checkedData.tags, newTag.name],
                buttons: [...checkedData.buttons, ...buttonSets.find(buttonSet => buttonSet.name === setName)?.buttonList.filter(button => button.tag === newTag.name).map(button => button.name) ?? []],
            })
        }

    }

    const onCheckedButtonsChange = (setName: string) => (newButton: ButtonData) => {

        if (checkedData.buttons.includes(newButton.name)) {
            const newCheckedData = checkedData.buttons.filter((checkedButton) => checkedButton !== newButton.name)
            const removeSet = checkedData.sets.filter((checkedSet) => checkedSet != setName)
            const removeTag = checkedData.tags.filter((checkedTag) => checkedTag != newButton.tag)

            setCheckedData({
                sets: removeSet,
                buttons: newCheckedData,
                tags: removeTag,
            })
        }
        else {
            setCheckedData({
                ...checkedData,
                buttons: [...checkedData.buttons, newButton.name],
            })
        }

    }

    const onSelectAllChange = () => {
        if (!selectAll) {
            setCheckedData({
                sets: buttonSets,
            })
        }
        setSelectAll((past) => !past)
    }

    return <div className={"flex flex-col w-full h-full"}>
        <h1 className={"text-4xl font-bold mx-auto text-center my-2"}>
            Export
        </h1>
        <input type="text" className={"w-fit text-2xl p-2 my-4 mx-auto border-2 border-gray-300 rounded-2xl"}
               placeholder={"Set name"} onChange={(e) => {
            setSetName(e.target.value)
        }} value={setName}/>
        <div className={"flex flex-row justify-between px-2 mx-2"}>
            <div>
                <input type="checkbox" className={"mr-2"} checked={selectAll} onChange={onSelectAllChange}/>
                <label className={"text-xl font-bold border-b-2 "}>Select All</label>
            </div>
            <div>
                <button onClick={() => {
                    setCheckedData({
                        tags: [],
                        buttons: [],
                        sets: []
                    })
                    setSelectAll(false)
                }}> Clear all
                </button>
            </div>
        </div>
        <ul className={"text-lg max-h-[50vh] overflow-y-auto border-2 border-gray-400 rounded-lg p-2 m-2"}>
            {buttonSets.map((buttonSet, index) => {
                if (buttonSet.buttonList.length === 0) {
                    return null;
                }

                return <div key={index} className={"pl-2 my-2 border-l-2 border-gray-400"}>
                    <input type="checkbox" className={"mr-2"}
                           checked={checkedData.sets.includes(buttonSet.name)}
                           onChange={() => onCheckedSetChange(buttonSet)}/>
                    <label className={"text-xl font-bold"}>{buttonSet.name}</label>

                    {buttonSet.tags.map((tag, index) => {
                        return <div key={index} className={"pl-2 my-2 border-l-2 border-gray-400"}>
                            <input type="checkbox" className={"mr-2"}
                                   checked={checkedData.tags.includes(tag.name)}
                                   onChange={() => onCheckedTagsChange(buttonSet.name)(tag)}/>
                            <label className={"text-xl font-bold"}>{tag.name}</label>
                            <div>
                                {buttonSet.buttonList.filter((button: ButtonData) => button.tag === tag.name).map((button: ButtonData) => {
                                    return <div className={"flex flex-row pl-4"} key={button.name}>
                                        <input type="checkbox" className={"mr-2"}
                                               checked={checkedData.buttons.includes(button.name)}
                                               onChange={() => onCheckedButtonsChange(buttonSet.name)(button)}
                                        />
                                        <label>{button.name}</label>
                                    </div>
                                })}
                            </div>
                        </div>
                    })}
                </div>

            })}

            {/*{buttonList.filter((button: ButtonData) => button.tag === undefined || !tags.map(tag => tag.name).includes(button.tag)).map((button: ButtonData) => {*/
            }
            {/*    return <div key={button.name}>*/
            }
            {/*        <input type="checkbox" className={"mr-2"}*/
            }
            {/*               onChange={() => onCheckedButtonsChange(button.name)}*/
            }
            {/*               checked={checkedData.buttons.includes(button.name)}/>*/
            }
            {/*        <label>{button.name}</label>*/
            }
            {/*    </div>*/
            }
            {/*})}*/
            }
        </ul>
        <button className={"w-full mt-4"} onClick={() => {
            exportAll(checkedData.tags, checkedData.buttons, setName);
            close()
        }}>
            Export
        </button>
    </div>
}