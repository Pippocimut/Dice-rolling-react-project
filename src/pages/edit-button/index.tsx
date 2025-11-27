import ButtonForm from "../main/components/ButtonForm.tsx";
import {useCallback} from "react";
import {deleteButtonOfSet, upsertButtonOfSet} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const EditButtonPage = () => {

    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets[state.buttonSet.selectedSetId])
    const selectedButton = useSelector((state: RootState) => state.buttonManage.button)
    const navigate = useNavigate();

    if (!selectedButton) throw new Error("Button not found")

    const dispatch = useDispatch();

    const deleteButton = useCallback(() => {
        dispatch(deleteButtonOfSet({setId: selectedSetId, id: selectedButton.id}))
        navigate("/")
    }, [buttonSet]);

    const button = useSelector((state: RootState) => state.buttonManage.button)

    const areAllFieldsFilled = () => {
        if (button.name == "") {
            return false
        }
        return Object.values(button.rolls).length !== 0;
    }

    const correctOnClick = () => {
        if (areAllFieldsFilled()) {
            dispatch(upsertButtonOfSet({
                button,
                setId: selectedSetId
            }))
        } else {
            toast.error("Button name and rolls cannot be empty")
        }
        navigate("/")
    }

    return <div className={"flex flex-col gap-4 w-full mx-auto"}>
        <div className={"flex flex-col gap-4 border-1 rounded-md w-full max-w-130 mx-auto my-12"}>
            <ButtonForm>
                <Button id={"delete"} className="bg-danger  hover:bg-red-600"
                        onClick={deleteButton}>
                    Delete Button
                </Button>
                <Button
                    className={"bg-green-500 text-white hover:bg-green-600 ml-auto " + (areAllFieldsFilled() ? "" : "opacity-30")}
                    onClick={correctOnClick} type={"submit"}>
                    {"Edit"}
                </Button>
            </ButtonForm>
        </div>
    </div>
}


export default EditButtonPage;
