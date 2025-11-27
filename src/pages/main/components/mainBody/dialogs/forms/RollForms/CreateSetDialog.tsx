import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@radix-ui/react-label";
import {Button} from "@/components/ui/button.tsx";
import {
    useSets
} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useSets.tsx";

type Props = {
    openSetDialog: boolean;
    setOpenSetDialog: (open: boolean) => void;
    closeMenu: () => void;
};

export const CreateSetDialog: React.FC<Props> = ({openSetDialog, setOpenSetDialog, closeMenu}) => {
    const {name, handleChange, handleConfirm, errorMessage} = useSets(openSetDialog, setOpenSetDialog);



    return (
        <Dialog open={openSetDialog} onOpenChange={setOpenSetDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set creation form</DialogTitle>
                    <DialogDescription>Fill in the form to create a new set</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Input
                        id="set-input"
                        value={name}
                        onChange={handleChange}
                        placeholder="Enter set name"
                        aria-invalid={!!errorMessage}
                        aria-describedby="set-error"
                    />

                    <Label htmlFor="set-input" id="set-error" className="mt-2 text-sm text-red-700">
                        {errorMessage}
                    </Label>
                </div>

                <DialogFooter>
                    <Button onClick={handleConfirm(closeMenu)} disabled={name.trim() === "" || !!errorMessage}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

