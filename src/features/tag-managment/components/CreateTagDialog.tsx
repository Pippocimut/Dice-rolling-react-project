import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {TagForm} from "@/features/tag-managment/components/TagForm.tsx";
import {addTagToSet, colors, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setButton} from "@/store/button-change-handle/buttonManageSlice.ts";
import {GeneralTriggersV12} from "@/store/button-sets/ButtonSetV1.2.ts";

export function CreateTagDialog(){
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
    const button = useSelector((state:RootState)=> state.buttonManage.button)
    const [tag, setTag] = useState<Tag>({
        name: "",
        color: "red-roll-button",
        id: -1,
        buttonConfig:{}
    });

    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])

    const tags = currentSet.tags;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setButton({
            id: -1,
            name: "New State",
            rolls: [],
            tag: -1,
            nextTriggerId: 1,
            triggers: {
                [GeneralTriggersV12.OnRoll]: {
                    id: GeneralTriggersV12.OnRoll,
                    name: "On roll"
                },
                [GeneralTriggersV12.None]: {
                    id:GeneralTriggersV12.None,
                    name: "None"
                }
            },
            color: colors[Math.floor(Math.random() * colors.length)],
            position: -1
        }))
    }, [isCreateTagOpen]);

    const createTag = () => {
        const matchingTag = Object.values(tags).find(Itag => Itag.name.toLowerCase() === tag.name.toLowerCase())

        if (tag.name === "" || matchingTag) {
            return
        }

        dispatch(addTagToSet({
            setId: currentSet.id,
            tag: {
                ...tag,
                buttonConfig: {
                    triggers:button.triggers,
                    nextTriggerId:button.nextTriggerId,
                    rolls:button.rolls,
                }
            }
        }))

        setIsCreateTagOpen(false);
    }

    return <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
        <DialogTrigger asChild>
            <Button id={"create-tag-button"} className={"w-full"} variant={"outline"}
                    onClick={() => setIsCreateTagOpen(true)}>
                <span className={"mb-1 text-2xl"}>+</span>
            </Button>
        </DialogTrigger>
        <DialogContent className={"w-fit"} onOpenAutoFocus={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Create Tag</DialogTitle>
                <DialogDescription>
                    Fill the form to create a tag
                </DialogDescription>
            </DialogHeader>
            <TagForm tag={tag} setTag={setTag}>
                <Button className={"mt-4 bg-blue-700 text-white"} onClick={createTag}>
                    Create Tag
                </Button>
            </TagForm>
        </DialogContent>
    </Dialog>
}