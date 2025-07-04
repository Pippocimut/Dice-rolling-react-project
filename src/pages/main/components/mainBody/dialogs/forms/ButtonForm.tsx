import {useCallback, useMemo, useState} from "react";
import {toast} from "react-toastify";
import type {Roll} from "../../../../types.ts";
import RollForm from "./RollForm.tsx";
import RollDialog from "../RollDialog.tsx";
import TagSelection, {colors} from "./TagSelection.tsx";
import RollsList from "./RollsList.tsx";
import {type ButtonData, type Tag} from "../../../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";
import {
    addButtonToSet,
    updateButtonOfSet,
    deleteButtonOfSet
} from "../../../../../../store/button-sets/buttonSetSlice.ts";

type Props =
    | {
    mode: "create";
    close: () => void;
    selectedTag?: Tag;
    selectedButtonIndex?: never;
    selectedSetName: string;
}
    | {
    mode: "edit";
    close: () => void;
    selectedTag?: never;
    selectedButtonIndex: number;
    selectedSetName: string;
};

const ButtonForm = ({
                        mode,
                        close,
                        selectedTag,
                        selectedButtonIndex,
                        selectedSetName
                    }: Props) => {

        const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
        const dispatch = useDispatch();


        const selectedButton = useMemo(() => {
            if (mode == "edit") {
                if (selectedButtonIndex === undefined || selectedButtonIndex === -1) return undefined;
                return buttonSets.find((set) => set.name === selectedSetName)!.buttonList[selectedButtonIndex];
            }
        }, [mode, buttonSets, selectedButtonIndex]);

        const isEditing = mode === "edit" && selectedButton !== undefined;
        const [name, setName] = useState(isEditing ? selectedButton.name : "");
        const [rolls, setRolls] = useState<Roll[]>(isEditing ? selectedButton.rolls : []);
        const [color, setColor] = useState<string>(isEditing ? selectedButton.color : selectedTag?.color ?? colors[Math.floor(Math.random() * colors.length)]);

        const buttonTag = buttonSets.find((set) => set.name === selectedSetName)!.tags.find((tag) => tag.id === selectedButton?.tag)

        const defaultTag = {
            id: -1,
            color: colors[Math.floor(Math.random() * colors.length)],
            name: ""
        }
        const [tag, setTag] = useState<Tag>(selectedTag ?? buttonTag ?? defaultTag)

        const [isOpenNewRollDialog, setIsOpenNewRollDialog] = useState(false);

        const createNewButton = () => {
            if (name == "") {
                toast.error("Button name cannot be empty");
                return;
            }

            if (rolls.length === 0) {
                toast.error("Button must have at least one roll");
                return;
            }

            const newButton: Partial<ButtonData> = {
                ...selectedButton,
                name: name,
                rolls: rolls,
                color: color,
                tag: tag.id ? tag.id : undefined,
            };

            if (mode === "edit") {
                dispatch(updateButtonOfSet({button: newButton, tag: tag, setName: selectedSetName}))
            } else {
                dispatch(addButtonToSet({button: newButton, tag: tag, setName: selectedSetName}))
            }

            setRolls([]);
            close();
        };

        const deleteButton = useCallback(() => {
            dispatch(deleteButtonOfSet({setName: selectedSetName, index: selectedButtonIndex}))
            close();
        }, [buttonSets]);

        return (
            <div className={"flex flex-col gap-2 p-4 h-fit w-fit justify-center items-center"}>
                <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
                    <button className={"px-4 text-6xl"} onClick={close}>
                        ✕
                    </button>
                </div>

                <div>
                    <h1 className={"text-4xl font-bold"}>
                        {" "}
                        {mode === "edit" ? "Edit" : "Create"} Button{" "}
                    </h1>
                </div>

                <div className={"flex flex-col gap-2"}>
                    <input
                        className={
                            "p-4 m-4 w-70 border-2 border-gray-500 rounded-lg text-left"
                        }
                        type={"text"}
                        placeholder={"Button's Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <TagSelection
                    tag={tag} setTag={setTag}
                    buttonColor={color}
                    setButtonColor={(value: string) => setColor(value)}
                    selectedSet={selectedSetName ?? "Default"}/>

                <div className={"flex flex-row gap-2"}>
                    <button className={"px-6 m-4"} onClick={() => setRolls([])}>
                        Clear rolls
                    </button>

                    <button className={"px-6 m-4"} onClick={() => setIsOpenNewRollDialog(true)}>
                        Add roll
                    </button>
                </div>

                <RollsList rolls={rolls} setRolls={setRolls}/>

                <div className="p-4 flex flex-row gap-2 w-full justify-center items-center">
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={createNewButton}>
                        {mode === "edit" ? "Edit" : "Create"} Button
                    </button>
                    {mode === "edit" && (
                        <button id={"delete"} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={deleteButton}>
                            Delete Button
                        </button>
                    )}
                </div>

                <RollDialog isOpen={isOpenNewRollDialog} onClose={() => setIsOpenNewRollDialog(false)}>
                    <RollForm
                        createRoll={(roll: Roll) => {
                            setRolls((prev) => [...prev, roll]);
                            setIsOpenNewRollDialog(false);
                        }}
                    />
                </RollDialog>
            </div>
        );
    }
;

export default ButtonForm;
