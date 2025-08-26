import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {addTagToSet, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import {TagForm} from "@/pages/main/components/mainBody/dialogs/forms/TagForms/TagForm.tsx";

type Props = {
    close: () => void;
}

export function CreateTagForm(props: Props) {
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

        props.close()
    }

    return (<TagForm tag={tag} setTag={setTag}>
        <Button className={"mt-4 bg-blue-700 text-white"} onClick={createTag}>
            Create Tag
        </Button>
    </TagForm>)
}