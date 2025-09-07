import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {editTagOfSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {TagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/TagForm.tsx";

type Props = {
    tag: Tag,
    close: () => void,
}

export function EditTagForm(props: Props) {
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
        props.close()
    }

    return (<TagForm tag={tag} setTag={setTag}>
        <Button className={"mt-4 bg-green-700 text-white"} onClick={editTag}>
            Edit Tag
        </Button>
    </TagForm>)
}