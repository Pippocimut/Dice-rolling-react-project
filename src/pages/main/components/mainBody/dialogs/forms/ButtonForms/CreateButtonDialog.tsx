import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {type PropsWithChildren, useCallback, useState} from "react";
import {addButtonToSet, type ButtonData, colors, type Tag} from "@/store/button-sets/buttonSetSlice.ts";
import ButtonForm from "@/pages/main/components/mainBody/dialogs/forms/ButtonForms/ButtonForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {Button} from "@/components/ui/button.tsx";
import type {RootState} from "@/store";
import {toast} from "react-toastify";

type Props = {
    selectedTag?: Tag;
}

export function CreateButtonDialog({children, selectedTag}: PropsWithChildren<Props>) {
    const dispatch = useDispatch();
    const defaultButton = {
        id: -1,
        name: "",
        rolls: selectedTag?.rollsConfig ?? [],
        tag: selectedTag?.id,
        color: selectedTag?.color ?? colors[Math.floor(Math.random() * colors.length)],
        position: -1
    }

    const [button, setButton] = useState<ButtonData>(defaultButton)

    const selectedSetId = useSelector((state: RootState) => state.buttonSet.selectedSetId)

    const areAllFieldsFilled = () => {
        return !(button.name == "" || button.rolls.length === 0);
    }

    const correctOnClick = useCallback(() => {
        if (areAllFieldsFilled()) {
            dispatch(addButtonToSet({
                button,
                setId: selectedSetId
            }))
            setButton(defaultButton)
        } else {
            toast.error("Button name and rolls cannot be empty")
        }
    }, [button])

    return <Dialog>
        <form>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={"w-fit"} onOpenAutoFocus={(e)=> e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>
                        Create Button
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the form to create a new button.
                    </DialogDescription>
                </DialogHeader>
                <ButtonForm button={button} setButton={setButton}>
                    {areAllFieldsFilled() && (
                        <DialogClose asChild>
                            <Button className=" bg-blue-500 text-white hover:bg-blue-600 ml-auto"
                                    onClick={correctOnClick}>
                                {"Create"}
                            </Button>
                        </DialogClose>
                    )}
                    {!areAllFieldsFilled() && (
                        <Button className=" bg-blue-500 text-white hover:bg-blue-600 ml-auto opacity-30"
                                onClick={correctOnClick}>
                            {"Create"}
                        </Button>
                    )}
                </ButtonForm>
            </DialogContent>
        </form>
    </Dialog>
}