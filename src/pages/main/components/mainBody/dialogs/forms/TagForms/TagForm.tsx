import {Input} from "@/components/ui/input.tsx";
import {TagColorSelection} from "@/pages/main/components/mainBody/dialogs/forms/TagColorSelection.tsx";
import {type PropsWithChildren, useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import type {Tag} from "@/store/button-sets/buttonSetSlice.ts";
import type {Roll} from "@/pages/main/types.ts";
import {RollSelection} from "@/pages/main/components/mainBody/dialogs/forms/RollSelection.tsx";
import {DialogFooter} from "@/components/ui/dialog.tsx";

type Props = {
    tag: Tag,
    setTag: (tag: Tag) => void,
}

export function TagForm(props: PropsWithChildren<Props>) {
    const [nameError, setNameError] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const equivalentTag = tags.find(tag => tag.name.toLowerCase() === e.target.value.toLowerCase())
        if (equivalentTag) {
            if (!(props.tag.id && equivalentTag.id === props.tag.id))
                setNameError("You cannot name this tag the same as another tag")
        } else {
            setNameError("");
        }
        props.setTag({
            ...props.tag,
            name: e.target.value,
        })
    }

    const sets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const currentSet = sets.find(set => set.id === selectedSetId)!

    const tags = currentSet.tags;

    return (<>
        <div className={"m-4 flex flex-row gap-4 justify-center items-center"}>
            <div id={"Name Selection"}>
                <label className={"text-danger"}>{nameError}</label>
                <Input id={"Name Selection"} type={"text"} placeholder={"Name Selection"} value={props.tag.name}
                       onChange={handleNameChange}/>
            </div>
            <div id={"Color selection"}>
                <TagColorSelection buttonColor={props.tag.color} setButtonColor={(color: string) => {
                    props.setTag({
                        ...props.tag,
                        color: color,
                    })
                }}/>
            </div>
        </div>
        <RollSelection rolls={props.tag.rollsConfig ?? []} setRolls={(rolls: Roll[]) => props.setTag({...props.tag, rollsConfig: rolls})}/>

        <DialogFooter>
            {props.children}
        </DialogFooter>
    </>)
}