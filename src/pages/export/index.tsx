import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useCallback, useEffect, useRef, useState} from "react";
import type {ButtonData, ButtonSet, Tag} from "@/store/button-sets/buttonSetSlice.ts";
import useCheckboxSelection
    from "@/pages/main/components/mainBody/dialogs/forms/export-select-form/useCheckboxSelection.tsx";
import {toast} from "react-toastify";
import {ButtonList} from "@/pages/main/components/mainBody/dialogs/forms/export-select-form/ButtonList.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {ChevronsUpDown, Download} from "lucide-react";

export const ExporPage = () => {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const [setName, setSetName] = useState("")
    const {onSelectAllChange, clearAll} = useCheckboxSelection();

    useEffect(clearAll, []);

    const noButtonsToDisplay = Object.values(buttonSets).filter((buttonSet) => Object.values(buttonSet.buttonList).length > 0).length === 0;

    return <div className={"flex flex-col w-1/3 mx-auto h-full"}>
        <h1 className={"text-4xl font-bold mx-auto text-center my-2"}>
            Export
        </h1>
        {noButtonsToDisplay && <h2 className={"text-xl font-bold mx-auto text-center my-4 p-4"}>
            No buttons to display, create some buttons
        </h2>}
        {!(noButtonsToDisplay) && <div className={"flex flex-col w-full h-full mt-6 mb-12"}>
            <div className={"flex flex-row justify-between items-center mx-4"}>
                <Input type="text" className={"w-full text-xl p-2 my-6 mr-auto border-2 border-gray-300 rounded-2xl"}
                       placeholder={"Set name"} onChange={(e) => {
                    setSetName(e.target.value)
                }} value={setName}/>
            </div>
            <div className={"flex flex-row justify-between px-2 mx-2"}>
                <Button variant={"outline"} onClick={onSelectAllChange}> Select all </Button>
                <Button variant={"outline"} onClick={clearAll}> Clear all </Button>
            </div>
            <ul className={"text-md h-fit border-1 border-gray-400 rounded-lg p-2 m-2"}>
                {Object.values(buttonSets).map((buttonSet) => <SetSelection buttonSet={buttonSet}/>)}
            </ul>
            <ExportButton setName={setName}/>
        </div>}
    </div>

}

const ExportButton = ({setName}: { setName: string }) => {
    const {
        checkedData,
        clearAll,
    } = useCheckboxSelection()

    const currentExportVersion = useSelector((state: RootState) => state.buttonSet.currentVersion)
    const exportLinkRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
        if (!exportLinkRef.current) {
            const link = document.createElement('a');
            link.download = setName + '.json';
            link.style.display = 'none';
            document.body.appendChild(link);
            exportLinkRef.current = link;
        }

        return () => {
            if (exportLinkRef.current) {
                document.body.removeChild(exportLinkRef.current);
                exportLinkRef.current = null;
            }
        };
    }, [setName]);

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const exportAll = useCallback((tags: number[], buttons: number[], setName: string) => {
        if (!exportLinkRef.current) return;

        const buttonListExport = Object.values(buttonSets).reduce((acc: Record<number, ButtonData>, set) => {
            buttons.forEach((buttonId) => {
                if (set.buttonList[buttonId]) {
                    acc[buttonId] = set.buttonList[buttonId]
                }
            })
            return acc
        }, {})

        const tagsExport = Object.values(buttonSets).reduce((acc: Record<number, Tag>, set) => {
            tags.forEach((tagId) => {
                if (set.tags[tagId]) {
                    acc[tagId] = set.tags[tagId]
                }
            })
            return acc
        }, {})

        const exportSet = {
            version: currentExportVersion,
            name: setName,
            buttonList: buttonListExport,
            tags: tagsExport
        }

        const jsonData = JSON.stringify(exportSet, null, 2);
        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        exportLinkRef.current.href = url;
        exportLinkRef.current.click();

        URL.revokeObjectURL(url);
    }, [buttonSets]);

    const onExportClick = () => {
        if (setName === "") {
            toast.error("Set name is required")
            return;
        }

        const allTags = Object.entries(checkedData.tags).reduce((acc: number[], {1: value}) => {
            acc.push(...value)
            return acc
        }, [])

        const allButtons = Object.entries(checkedData.buttons).reduce((acc: number[], {1: value}) => {
            acc.push(...value)
            return acc
        }, [])

        exportAll(allTags, allButtons, setName);
        clearAll();
        close()
    }

    return <Button className={"w-full mt-4"} onClick={onExportClick}>
        Download
        <Download className={"size-5"}/>
    </Button>

}

const SetSelection = ({buttonSet}: { buttonSet: ButtonSet }) => {

    const {
        checkedData,
        onCheckedSetChange,
    } = useCheckboxSelection()
    const isChecked = checkedData.sets.includes(buttonSet.id)
    const [isOpen, setIsOpen] = useState(false)
    const untaggedButtons = Object.values(buttonSet.buttonList).filter(
        (button: ButtonData) => !button.tag || !(buttonSet.tags[button.tag])
    )

    if (Object.values(buttonSet.buttonList).length === 0) return null;
    return <Collapsible open={isOpen} onOpenChange={setIsOpen}
                        className={"flex flex-col items-start justify-start pl-2 my-4"}
                        key={buttonSet.id}>
        <div className={"flex flex-row justify-start w-full border-b-1 border-gray-400 pb-2"}>
            <Input type="checkbox" id={"set-" + buttonSet.id}
                   className={"size-4 my-auto mr-2"}
                   checked={isChecked}
                   onChange={() => onCheckedSetChange(buttonSet)}/>
            <Label className={"text-md font-bold"}
                   htmlFor={"set-" + buttonSet.id}>Set: {buttonSet.name}</Label>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 ml-auto"
                        onClick={() => setIsOpen(!isOpen)}>
                    <ChevronsUpDown/>
                    <span className="sr-only">Toggle</span>
                </Button>
            </CollapsibleTrigger>
        </div>
        <ul className={"flex flex-col ml-2 mt-2 px-2 w-full border-l-1 border-gray-400"}>
            {Object.values(buttonSet.tags).map((tag) => <TagSelection buttonSet={buttonSet} tag={tag}/>)}
        </ul>
        <ButtonList buttonList={untaggedButtons} buttonSetId={buttonSet.id}/>
    </Collapsible>
}

const TagSelection = ({buttonSet, tag}: { buttonSet: ButtonSet, tag: Tag }) => {
    const {
        checkedData,
        onCheckedButtonsChange,
        onCheckedTagsChange
    } = useCheckboxSelection()
    const currentSetTags = checkedData.tags[buttonSet.id] ?? []
    const isChecked = currentSetTags.includes(tag.id)
    const [isOpen, setIsOpen] = useState(false)
    const onChangedTag = onCheckedTagsChange(buttonSet.id)

    const buttonList = Object.values(buttonSet.buttonList).filter((button: ButtonData) => button.tag === tag.id)

    return <CollapsibleContent>
        <li key={tag.id} className={"flex flex-col justify-start mb-2 w-full"}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}
                         className={"flex flex-col items-start justify-start pl-2 w-full"}>
                <div className={"flex flex-row justify-start w-full border-b-1 border-gray-400 pb-2"}>
                    <Input type="checkbox" id={"tag-" + tag.id}
                           className={"size-4 my-auto mr-2"}
                           checked={isChecked}
                           onChange={() => onChangedTag(tag)}/>
                    <Label className={"text-md font-bold"}
                           htmlFor={"tag-" + tag.id}>Tag: {tag.name}</Label>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 ml-auto"
                                onClick={() => setIsOpen(!isOpen)}>
                            <ChevronsUpDown/>
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <ul className={"flex flex-col gap-4 ml-2 mt-2 pl-2 border-l-1 border-gray-400"}>
                    {buttonList.map((button: ButtonData) => {
                        const currentSetButtons = checkedData.buttons[buttonSet.id] ?? []
                        const isChecked = currentSetButtons.includes(button.id)
                        const onChangedButton = onCheckedButtonsChange(buttonSet.id)

                        return <CollapsibleContent>
                            <li className={"flex flex-row pl-4"} key={button.id}>
                                <Input type="checkbox" className={"size-4 my-auto mr-2"}
                                       id={"button-" + button.id}
                                       checked={isChecked}
                                       onChange={() => onChangedButton(button)}
                                />
                                <Label htmlFor={"button-" + button.id}
                                       className={"text-md font-bold"}>Button: {button.name} </Label>
                            </li>
                        </CollapsibleContent>
                    })}
                </ul>
            </Collapsible>
        </li>
    </CollapsibleContent>
}