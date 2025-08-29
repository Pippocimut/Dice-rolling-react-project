import {type PropsWithChildren, useState} from "react";
import {toast} from "react-toastify";
import type {Roll} from "../../../../../types.ts";
import TagSelection, {colors} from "../TagSelection.tsx";
import {type ButtonData, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {RollSelection} from "@/pages/main/components/mainBody/dialogs/forms/RollSelection.tsx";

type Props = {
    title: string;
    selectedButton: ButtonData;
    submit: (data: { button: ButtonData, setId: number }) => void;
    close: () => void;
}

const ButtonForm = ({
                        close,
                        selectedButton,
                        title,
                        submit,
                        children
                    }: PropsWithChildren<Props>) => {

        const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
        const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
        const buttonTag = buttonSets.find((set) => set.id === selectedSetId)!.tags.find((tag) => tag.id === selectedButton?.tag)

        const [tag, setTag] = useState<Tag | undefined>(buttonTag)
        const [button, setButton] = useState<ButtonData>(selectedButton)

        const createNewButton = () => {
            if (button.name == "") {
                toast.error("Button name cannot be empty");
                return;
            }

            if (button.rolls.length === 0) {
                toast.error("Button must have at least one roll");
                return;
            }

            const newButton: ButtonData = {
                ...button,
                tag: tag ? tag.id : -1,
            };

            submit({button: newButton, setId: selectedSetId})

            close();
        };

        const currentSet = buttonSets.find((set) => set.id === selectedSetId);

        const handleTagChange = (id: number) => {
            if (currentSet) {
                setButton({...button, tag: id})
                setTag(currentSet.tags.find((tag) => tag.id === id))
            }
        }

        return (
            <div className={"flex flex-col bg-background text-text gap-6 p-4 h-fit w-full justify-center items-center"}>
                <h1 className={"text-4xl w-full text-center font-bold"}>
                    {title}
                </h1>

                <div className={"flex flex-col gap-2"}>
                    <Label htmlFor={"Button Name"}>Button Name</Label>
                    <Input
                        type={"text"}
                        id={"Button Name"}
                        placeholder={"Button's Name"}
                        value={button.name}
                        onChange={(e) => setButton({...button, name: e.target.value})}
                    />
                </div>

                <TagSelection
                    tag={button.tag ?? -1}
                    setTag={handleTagChange}
                    buttonColor={button.color ?? tag?.color ?? colors[0]}
                    setButtonColor={(value: string) => setButton({...button, color: value})}
                />

                <RollSelection rolls={button.rolls} setRolls={(rolls: Roll[]) => setButton({...button, rolls: rolls})}/>

                <div className="p-4 flex flex-row gap-2 w-full justify-center items-center">
                    {children}
                    <Button className=" bg-blue-500 text-white hover:bg-blue-600 ml-auto"
                            onClick={createNewButton}>
                        {title}
                    </Button>
                </div>
            </div>
        );
    }
;

export default ButtonForm;
