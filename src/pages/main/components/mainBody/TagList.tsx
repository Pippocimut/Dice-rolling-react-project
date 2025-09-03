import {Button} from "@/components/ui/button";
import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {deleteTagFromSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {useState} from "react";
import {EditTagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/EditTagForm.tsx";
import {Label} from "@/components/ui/label.tsx";

export function TagList() {
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const sets = useSelector((state: RootState) => state.buttonSet.sets)
    const currentSet = sets.find(set => set.id === selectedSetId)!
    const tags = currentSet.tags.filter(tag => tag.name !== "")

    const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false)

    const dispatch = useDispatch()

    const deleteTag = (id: number) => {
        dispatch(deleteTagFromSet({setId: selectedSetId, tagId: id}))
    }

    const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

    return <div className={"m-4 flex flex-col gap-4 justify-center items-center w-full"}>
        <Label className={"text-left w-full"}>Tag List</Label>
        {tags.map(tag => (
            <div key={tag.id} className={"w-full flex flex-row justify-between items-center gap-8 rounded-md border-neutral-200 border-1 shadow-sm p-4"}>
                <Button onClick={() => {
                    setSelectedTag(tag)
                    setEditDialogOpen(true)
                }} className={tag.color + " p-4"}>{tag.name}</Button>
                <div className="flex flex-row gap-2">
                    <Button onClick={
                        () => {
                            deleteTag(tag.id)
                        }
                    }
                            className={"bg-danger w-10 h-10"}>
                        X
                    </Button>

                </div>
            </div>
        ))}
        {selectedTag && <DefaultDialog isOpen={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <EditTagForm tag={selectedTag} close={() => setEditDialogOpen(false)}/>
        </DefaultDialog>}
    </div>
}