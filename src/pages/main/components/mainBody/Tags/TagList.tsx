import {Button} from "@/components/ui/button.tsx";
import type {RootState} from "@/store";
import {useDispatch, useSelector} from "react-redux";
import {deleteTagFromSet} from "@/store/button-sets/buttonSetSlice.ts";
import {EditTagDialog} from "@/pages/main/components/mainBody/Tags/EditTagDialog.tsx";
import {CreateTagDialog} from "@/pages/main/components/mainBody/Tags/CreateTagDialog.tsx";

export function TagList() {
    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])
    const tags = Object.values(currentSet.tags).filter(tag => tag.name !== "")

    const dispatch = useDispatch()

    const deleteTag = (id: number) => {
        dispatch(deleteTagFromSet({setId: currentSet.id, tagId: id}))
    }

    return <div className={"m-4 flex flex-col gap-4 justify-center items-center w-full min-w-40"}>
        {tags.map(tag => (
            <div key={tag.id}
                 className={"w-full flex flex-row justify-between items-center gap-8 rounded-md border-neutral-200 border-1 shadow-sm p-4"}>
                <div className={"flex flex-row gap-2 items-center"}>

                    <EditTagDialog tag={tag}/>
                </div>
                <div className="flex flex-row gap-2">
                    <Button onClick={() => {deleteTag(tag.id)}} className={"bg-danger w-10 h-10"}>
                        X
                    </Button>

                </div>
            </div>
        ))}
        <CreateTagDialog/>
    </div>
}