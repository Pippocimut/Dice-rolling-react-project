import ButtonForm from "./ButtonForm.tsx";
import {useCallback} from "react";
import {deleteButtonOfSet, updateButtonOfSet} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Button} from "@/components/ui/button.tsx";

type Props = {
    close: () => void;
    selectedButtonId: number;
};

const EditButtonForm = ({
                            close,
                            selectedButtonId
                        }: Props) => {

    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(
        (set) => set.id === selectedSetId
    ))

    const selectedButton = buttonSet?.buttonList.find(
        (button) => button.id === selectedButtonId
    )

    if (!selectedButton) throw new Error("Button not found")

    const dispatch = useDispatch();

    const deleteButton = useCallback(() => {
        dispatch(deleteButtonOfSet({setId: selectedSetId, id: selectedButton.id}))
        close();
    }, [buttonSet]);

    return <ButtonForm
        submit={(data) => {
            dispatch(updateButtonOfSet(data))
            close();
        }}

        selectedButton={selectedButton}  title={"Edit Button"} close={close}>

        <Button id={"delete"} className="bg-danger  hover:bg-red-600"
                onClick={deleteButton}>
            Delete Button
        </Button>
    </ButtonForm>
}

export default EditButtonForm;
