import {type PropsWithChildren, useState} from "react";
import type {Roll} from "../../../../../types.ts";
import TagSelection, {colors} from "../TagSelection.tsx";
import {type ButtonData, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {RollSelection} from "@/pages/main/components/mainBody/dialogs/forms/RollSelection.tsx";
import {DialogFooter} from "@/components/ui/dialog.tsx";

type Props = {
    button: ButtonData;
    setButton: (button: ButtonData) => void;
}

const ButtonForm = ({
                        button,
                        setButton,
                        children
                    }: PropsWithChildren<Props>) => {

        const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
        const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
        const buttonTag = buttonSets.find((set) => set.id === selectedSetId)!.tags.find((tag) => tag.id === button?.tag)

        const [tag, setTag] = useState<Tag | undefined>(buttonTag)

        const currentSet = buttonSets.find((set) => set.id === selectedSetId);

        const handleTagChange = (id: number) => {
            if (currentSet) {
                setButton({...button, tag: id})
                setTag(currentSet.tags.find((tag) => tag.id === id))
            }
        }

        return (
            <div className={"flex flex-col bg-background text-text gap-10 h-fit w-full justify-start items-start"}>
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

                <DialogFooter className=" flex flex-row gap-2 w-full justify-center items-center">
                    {children}
                </DialogFooter>
            </div>
        );
    }
;

export default ButtonForm;
