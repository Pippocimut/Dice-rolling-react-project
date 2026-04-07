import { type PropsWithChildren, useMemo, useState } from "react";
import TagSelection from "./mainBody/dialogs/forms/TagSelection.tsx";
import { colors, selectCurrentButton, upsertButtonOfSet, type Tag, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { RollSelection } from "@/pages/main/components/mainBody/dialogs/forms/RollSelection.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

const ButtonForm = ({ children }: PropsWithChildren) => {
    const dispatch = useDispatch();
    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])
    const button = useSelector(selectCurrentButton)!
    const buttonTag = currentSet.tags[button?.tag ?? -1]
    const [tag, setTag] = useState<Tag | undefined>(buttonTag)

    const handleTagChange = (id: number) => {
        if (currentSet) {
            let highest_trigger_id = Math.max(...Object.values(button.triggers).map(roll => roll.id), 0) + 1
            const triggers = {
                ...button.triggers,
                ...Object.values(currentSet.tags[id].buttonConfig.triggers ?? {}).reduce((acc, trigger) => {
                    acc[highest_trigger_id] = { ...trigger, id: highest_trigger_id++ };
                    return acc
                },
                    {} as Record<number, Trigger>)
            }

            console.log("Triggers after tag change: ", triggers)

            dispatch(upsertButtonOfSet({
                button: {
                    ...button,
                    ...currentSet.tags[id].buttonConfig,
                    triggers: triggers,
                    nextTriggerId: highest_trigger_id + 1,
                    tag: id
                }, setId: currentSet.id
            }))

            setTag(currentSet.tags[id])
        }
    }

    const color = useMemo(
        () => button.color ?? tag?.color ?? colors[0],
        [button.color, tag?.color]
    )

    const navigate = useNavigate()

    const duplicateButton = () => {
        console.log("To be implemented: duplicate button with id ", button.id)
        //dispatch(setButton({ ...button, name: button.name + " copy", id: -1 }))
        navigate("/button/create")
    }

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(upsertButtonOfSet({
            button: {
                ...button,
                name: e.target.value
            },
            setId: currentSet.id
        }))
    }

    const handleChangeColor = (value: string) => {
        dispatch(upsertButtonOfSet({
            button: {
                ...button,
                color: value
            },
            setId: currentSet.id
        }))
    }

    const cancelOnClick = () => navigate("/")

    return (
        <div
            className={"flex flex-col rounded-md text-text gap-10 h-fit w-full p-12 justify-center items-center"}>
            <div
                className={"flex flex-col bg-background text-text gap-6 h-fit w-full px-12 justify-center items-center"}>
                <div className={"flex flex-row gap-2 w-full justify-end items-center"}>
                    <Button onClick={duplicateButton}>
                        Duplicate
                    </Button>
                </div>
                <div className={"flex flex-col gap-2"}>
                    <Label htmlFor={"Button Name"}>Button Name</Label>
                    <Input
                        type={"text"}
                        id={"Button Name"}
                        placeholder={"Button's Name"}
                        value={button.name}

                        onChange={handleChangeName}
                    />
                </div>

                <TagSelection
                    tag={button.tag ?? -1}
                    setTag={handleTagChange}
                    buttonColor={color}
                    setButtonColor={handleChangeColor}
                />

                <RollSelection />
            </div>

            <DialogFooter className=" flex flex-row gap-2 w-full justify-between items-center">
                <Button id={"delete"} variant={"outline"} onClick={cancelOnClick}>
                    Cancel
                </Button>
                {children}
            </DialogFooter>
        </div>
    );
}
    ;

export default ButtonForm;
