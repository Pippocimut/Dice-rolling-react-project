import {Button} from "@/components/ui/button.tsx";
import ButtonForm from "@/pages/main/components/ButtonForm.tsx";
import {useCallback} from "react";
import {upsertButtonOfSet} from "@/store/button-sets/buttonSetSlice.ts";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useNavigate} from "react-router-dom";

export const CreateButtonPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const button = useSelector((state: RootState) => state.buttonManage.button)
    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const areAllFieldsFilled = () => {
        return !(button.name == "" || Object.values(button.rolls).length === 0);
    }

    const correctOnClick = useCallback(() => {
        if (areAllFieldsFilled()) {
            dispatch(upsertButtonOfSet({
                button,
                setId: selectedSetId
            }))
            navigate("/")
        } else {
            toast.error("Button name and rolls cannot be empty")
        }

    }, [button])

    return <div className={"flex flex-col gap-4 w-full mx-auto"}>
        <div className={"flex flex-col gap-4 border-1 rounded-md w-full max-w-130 mx-auto my-12"}>
            <ButtonForm>
                <Button
                    className={" bg-blue-500 text-white hover:bg-blue-600 ml-auto " + (areAllFieldsFilled() ? "" : "opacity-30")}
                    onClick={correctOnClick}>
                    {"Create"}
                </Button>
            </ButtonForm>
        </div>
    </div>
}