import {toggleEditMode} from "@/store/selected/selectedSlice.ts";
import {BsPencilFill} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Button} from "@/components/ui/button.tsx";

export function ToggleEditModeButton() {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.selected.editMode)

    const buttonVariant = editMode ? "outline" : "default"

    return <Button
        id="editModeButton"
        variant={buttonVariant}
        className={"w-20 h-20 text-5xl transition-all font-bold gap-0"}
        onClick={() => dispatch(toggleEditMode())}>{
        editMode ?
            <span className={"pb-2"}>&#10004;</span> :
            <BsPencilFill className="size-6"/>
    }</Button>
}
