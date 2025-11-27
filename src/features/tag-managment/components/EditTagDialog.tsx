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
import {editTagOfSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setButton} from "@/store/button-change-handle/buttonManageSlice.ts";

export function EditTagDialog(props: {tag:Tag}){
    const [isEditTagOpen, setIsEditTagOpen] = useState(false);
    const button = useSelector((state:RootState)=> state.buttonManage.button)

    const [tag, setTag] = useState<Tag>({
        ...props.tag,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(props.tag.buttonConfig)
        dispatch(setButton(props.tag.buttonConfig))
    }, [isEditTagOpen]);

    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])
    const tags = currentSet.tags;

    const editTag = () => {

        const matchingTag = Object.values(tags).find(Itag => Itag.name.toLowerCase() === tag.name.toLowerCase())

        if (tag.name === "" || (matchingTag && matchingTag.id !== tag.id)) {
            return
        }

        dispatch(editTagOfSet({
            setId: currentSet.id,
            tagId: props.tag.id,
            newTag: {
                ...tag,
                buttonConfig: {
                    triggers:button.triggers,
                    nextTriggerId:button.nextTriggerId,
                    rolls:button.rolls,
                }
            }
        }))
        setIsEditTagOpen(false)
    }

    return <Dialog open={isEditTagOpen} onOpenChange={setIsEditTagOpen}>
        <DialogTrigger asChild>
            <Button id={"create-tag-button"} className={"w-fit"} variant={"outline"}
                    onClick={() => setIsEditTagOpen(true)}>
                <div className={"w-5 h-5 rounded-full border-1 border-gray-300 shadow-md mr-4 "+tag.color}/>
                <span>{tag.name}</span>
            </Button>
        </DialogTrigger>
        <DialogContent className={"w-fit"} onOpenAutoFocus={(e)=> e.preventDefault()}>
            <DialogHeader>
                <DialogTitle>Edit Tag</DialogTitle>
                <DialogDescription>
                    Fill the form to create a tag
                </DialogDescription>
            </DialogHeader>
            <TagForm tag={tag} setTag={setTag}>
                <Button className={"mt-4 bg-green-700 text-white"} onClick={editTag}>
                    Edit Tag
                </Button>
            </TagForm>
        </DialogContent>
    </Dialog>
}