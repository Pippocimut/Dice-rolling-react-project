import ButtonForm from "./ButtonForm.tsx";
import {useCallback} from "react";
import {deleteButtonOfSet, updateButtonOfSet} from "../../../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../../../store";

type Props = {
    close: () => void;
    selectedButtonId: number;
    selectedSetName: string;
};

const EditButtonForm = ({
                            close,
                            selectedButtonId,
                            selectedSetName
                        }: Props) => {
    const buttonSet = useSelector((state: RootState) => state.buttonSet.sets.find(
        (set) => set.name === selectedSetName
    ))

    const selectedButton = buttonSet?.buttonList.find(
        (button) => button.id === selectedButtonId
    )

    if (!selectedButton) throw new Error("Button not found")

    const dispatch = useDispatch();

    const deleteButton = useCallback(() => {
        dispatch(deleteButtonOfSet({setName: selectedSetName, id: selectedButton.id}))
        close();
    }, [buttonSet]);

    return <ButtonForm
        submit={(data) => {
            dispatch(updateButtonOfSet(data))
            close();
        }}
        selectedButton={selectedButton} selectedSetName={selectedSetName} title={"Edit Button"} close={close}>
        <button id={"delete"} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={deleteButton}>
            Delete Button
        </button>
    </ButtonForm>
}

export default EditButtonForm;
