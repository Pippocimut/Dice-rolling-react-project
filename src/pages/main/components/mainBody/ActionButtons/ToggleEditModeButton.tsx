import {toggleEditMode} from "@/store/selected/selectedSlice.ts";
import {BsPencilFill} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";

export function ToggleEditModeButton() {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.selected.editMode)

    return <button
        id="editModeButton"
        className={"w-20 h-20 rounded-xl hover:outline-2 text-2xl " + (editMode ? " bg-white border-4 border-primary text-primary" : " bg-primary text-white")}
        onClick={() => dispatch(toggleEditMode())}>{
        editMode ? <span className={"text-5xl pb-2 font-bold"}>&#10004;</span> : <div
            className={"flex justify-center gap-2 items-center"}
        ><BsPencilFill/></div>
    }</button>
}
