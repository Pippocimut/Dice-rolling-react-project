import ButtonForm from "./ButtonForm.tsx";
import {useCallback, useState, type PropsWithChildren} from "react";
import {deleteButtonOfSet, updateButtonOfSet, type ButtonData} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {toast} from "react-toastify";

type Props = {
    selectedButtonId: number;
    open?: boolean;
    setOpen?: (open: boolean) => void;
} | {
    selectedButtonId: number;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const EditButtonDialog = ({
                              selectedButtonId,
                              children,
                              open,
                              setOpen
                          }: PropsWithChildren<Props>) => {

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

    const [button, setButton] = useState<ButtonData>(selectedButton)

    const areAllFieldsFilled = () => {
        if (button.name == "") {
            return false
        }
        return button.rolls.length !== 0;
    }

    const correctOnClick = () => {
        if (areAllFieldsFilled()) {
            dispatch(updateButtonOfSet({
                button,
                setId: selectedSetId
            }))
            console.log(button)
        } else {
            toast.error("Button name and rolls cannot be empty")
        }
    }

    return <Dialog {...((setOpen !== undefined) ? {
        open: open,
        onOpenChange: setOpen
    } : {})}>
        <form>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={"w-fit"}>
                <DialogHeader>
                    <DialogTitle>
                        Edit Button
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the form to edit a new button.
                    </DialogDescription>
                </DialogHeader>
                <ButtonForm button={button} setButton={setButton}>
                    {areAllFieldsFilled() && (
                        <DialogClose asChild>
                            <Button className=" bg-green-500 text-white hover:bg-green-600 ml-auto"
                                    onClick={correctOnClick} type={"submit"}>
                                {"Edit"}
                            </Button>
                        </DialogClose>
                    )}
                    {!areAllFieldsFilled() && (
                        <Button className=" bg-green-500  text-white hover:bg-green-600 ml-auto opacity-30"
                                onClick={correctOnClick}>
                            {"Edit"}
                        </Button>
                    )}
                    <Button id={"delete"} className="bg-danger  hover:bg-red-600"
                            onClick={deleteButton}>
                        Delete Button
                    </Button>
                </ButtonForm>
            </DialogContent>
        </form>
    </Dialog>
}


export default EditButtonDialog;
