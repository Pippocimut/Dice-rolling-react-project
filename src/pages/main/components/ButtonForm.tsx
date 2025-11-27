import {type PropsWithChildren, useMemo, useState} from "react";
import TagSelection from "./mainBody/dialogs/forms/TagSelection.tsx";
import {colors, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {RollSelection} from "@/pages/main/components/mainBody/dialogs/forms/RollSelection.tsx";
import {DialogFooter} from "@/components/ui/dialog.tsx";
import {setButton} from "@/store/button-change-handle/buttonManageSlice.ts";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

const ButtonForm = ({children}: PropsWithChildren) => {
        const dispatch = useDispatch();
        const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])
        const button = useSelector((state: RootState) => state.buttonManage.button)
        const buttonTag = currentSet.tags[button?.tag ?? -1]
        const [tag, setTag] = useState<Tag | undefined>(buttonTag)

        const handleTagChange = (id: number) => {
            if (currentSet) {
                dispatch(setButton({
                    ...button, ...currentSet.tags[id].buttonConfig,
                    color: currentSet.tags[id].color,
                    tag: id
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
            dispatch(setButton({...button, name: button.name + " copy", id:-1}))
            navigate("/button/create")
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

                            onChange={(e) => dispatch(setButton({...button, name: e.target.value}))}
                        />
                    </div>

                    <TagSelection
                        tag={button.tag ?? -1}
                        setTag={handleTagChange}
                        buttonColor={color}
                        setButtonColor={(value: string) => dispatch(setButton({...button, color: value}))}
                    />

                    <RollSelection/>
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
