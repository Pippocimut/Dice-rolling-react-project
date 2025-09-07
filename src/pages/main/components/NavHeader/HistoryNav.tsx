import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import RollHistoryPanel from "@/pages/main/components/NavHeader/RollHistoryPanel.tsx";
import {useState} from "react";

export function HistoryNav() {
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

    return <>
        <Button onClick={() => setIsHistoryDialogOpen(true)}>History</Button>
        <DefaultDialog
            isOpen={isHistoryDialogOpen}
            onClose={() => {
                setIsHistoryDialogOpen(false);
            }}
        >
            <RollHistoryPanel/>
        </DefaultDialog>
    </>
}