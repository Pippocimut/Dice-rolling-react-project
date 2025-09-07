import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {TagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/TagForm.tsx";
import {editTagOfSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

export function EditTagDialog(props: {tag:Tag}){
    const [isEditTagOpen, setIsEditTagOpen] = useState(false);

    const [tag, setTag] = useState<Tag>({
        ...props.tag,
        rollsConfig: props.tag.rollsConfig ?? []
    });

    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.selected.selectedSetId])
    const tags = currentSet.tags;

    const dispatch = useDispatch();

    const editTag = () => {

        const matchingTag = Object.values(tags).find(Itag => Itag.name.toLowerCase() === tag.name.toLowerCase())

        if (tag.name === "" || (matchingTag && matchingTag.id !== tag.id)) {
            return
        }

        dispatch(editTagOfSet({
            setId: currentSet.id,
            tagId: props.tag.id,
            newTag: tag
        }))
        setIsEditTagOpen(false)
    }

    return <Dialog open={isEditTagOpen} onOpenChange={setIsEditTagOpen}>
        <DialogTrigger asChild>
            <Button id={"create-tag-button"} className={"w-fit "+tag.color} variant={"outline"}
                    onClick={() => setIsEditTagOpen(true)}>
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