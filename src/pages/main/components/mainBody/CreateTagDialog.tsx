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
import {addTagToSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

export function CreateTagDialog(){
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

    const [tag, setTag] = useState<Tag>({
        name: "",
        color: "red-roll-button",
        id: -1,
        rollsConfig: []
    });

    const sets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const currentSet = sets.find(set => set.id === selectedSetId)!

    const tags = currentSet.tags;

    const dispatch = useDispatch();

    const createTag = () => {
        const matchingTag = tags.find(Itag => Itag.name.toLowerCase() === tag.name.toLowerCase())

        if (tag.name === "" || matchingTag) {
            return
        }

        dispatch(addTagToSet({
            setId: selectedSetId,
            tag: tag
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