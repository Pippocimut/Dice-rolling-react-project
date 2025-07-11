import {type PropsWithChildren, useState} from "react";
import {toast} from "react-toastify";
import type {Roll} from "../../../../types.ts";
import RollForm from "./RollForm.tsx";
import RollDialog from "../RollDialog.tsx";
import TagSelection, {colors} from "./TagSelection.tsx";
import RollsList from "./RollsList.tsx";
import {type ButtonData, type Tag} from "../../../../../../store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";

type Props = {
    title: string;
    selectedButton: ButtonData;
    submit: (data: { button: Partial<ButtonData>, tag: Tag, setName: string }) => void;
    close: () => void;
    selectedSetName: string;
}

const ButtonForm = ({
                        close,
                        selectedButton,
                        selectedSetName,
                        title,
                        submit,
                        children
                    }: PropsWithChildren<Props>) => {

        const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

        const [name, setName] = useState(selectedButton.name);
        const [rolls, setRolls] = useState<Roll[]>(selectedButton.rolls);
        const [color, setColor] = useState<string>(selectedButton.color);

        const buttonTag = buttonSets.find((set) => set.name === selectedSetName)!.tags.find((tag) => tag.id === selectedButton?.tag)

        const defaultTag = {
            id: -1,
            color: colors[Math.floor(Math.random() * colors.length)],
            name: ""
        }
        const [tag, setTag] = useState<Tag>(buttonTag ?? defaultTag)

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

            submit({button: newButton, tag: tag, setName: selectedSetName})


            setRolls([]);
            close();
        };

        return (
            <div className={"flex flex-col gap-2 p-4 h-fit w-fit justify-center items-center"}>
                <div className={"flex flex-row gap-2 w-full justify-end items-end"}>
                    <button className={"px-4 text-6xl"} onClick={close}>
                        ✕
                    </button>
                </div>

                <div>
                    <h1 className={"text-4xl font-bold"}>
                        {title}
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
                        {title}
                    </button>
                    {children}
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
