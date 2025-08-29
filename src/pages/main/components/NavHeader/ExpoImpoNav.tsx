import {Button} from "@/components/ui/button.tsx";
import {Settings} from "@/pages/main/components/mainBody/Settings.tsx";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {useState} from "react";

export function ExpoImpoNav() {
    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

    return <>
        <Button onClick={() => setIsSettingsDialogOpen(true)}>
            Export/Import
        </Button>
        <DefaultDialog
            isOpen={isSettingsDialogOpen}
            onClose={() => {
                setIsSettingsDialogOpen(false);
            }}
        >
            <div>
                <Settings/>
            </div>
        </DefaultDialog>
    </>
}