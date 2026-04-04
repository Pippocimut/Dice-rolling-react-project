import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button.tsx";
import { toggleEditMode } from "@/store/selectedSlice.ts";
import { BsPencilFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { createNewBlankButton } from "@/store/button-sets/buttonSetSlice";

function MainActionButtons({ areThereButtons = false }: { areThereButtons?: boolean }) {
    const bigButtonClass = "w-40 h-40 text-8xl"
    const smallButtonClass = "w-20 h-20 text-6xl"

    const buttonClass = areThereButtons ? smallButtonClass : bigButtonClass

    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(createNewBlankButton({ setId: selectedSetId }))
        navigate("/button/create")
    }

    return <Button
        id="createButton"
        onClick={onClick}
        className={buttonClass}>
        <span className={"text-white pb-3"}>+</span>
    </Button>

}

function ToggleEditModeButton({ areThereButtons = false }: { areThereButtons?: boolean }) {
    const dispatch = useDispatch();
    const editMode = useSelector((state: RootState) => state.selected.editMode)

    const buttonVariant = editMode ? "outline" : "default"

    if (!areThereButtons) return null;

    return <Button
        id="editModeButton"
        variant={buttonVariant}
        className={"w-20 h-20 text-5xl transition-all font-bold gap-0"}
        onClick={() => dispatch(toggleEditMode())}>{
            editMode ?
                <span className={"pb-2"}>&#10004;</span> :
                <BsPencilFill className="size-6" />
        }</Button>
}


export function ActionButtons() {
    const areThereButtons = useSelector((state: RootState) =>
        !(Object.values(state.buttonSet.sets[state.buttonSet.selectedSetId].buttonList).filter(button => !button.isNotComplete).length === 0)
    )

    return <div
        className={"flex flex-row flex-wrap items-center justify-center w-fit gap-8"}>
        <ToggleEditModeButton areThereButtons={areThereButtons} />
        <MainActionButtons areThereButtons={areThereButtons} />
    </div>

}