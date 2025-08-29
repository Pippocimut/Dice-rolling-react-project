import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {Connect} from "@/pages/main/components/NavHeader/Connect.tsx";

export function ConnectNav() {

    const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
    return (<>
            <Button onClick={() => setIsConnectDialogOpen(true)}>Connect</Button>
            <DefaultDialog
                isOpen={isConnectDialogOpen}
                onClose={() => {
                    setIsConnectDialogOpen(false);
                }}
            >
                <div>
                    <Connect/>
                </div>
            </DefaultDialog>
        </>
    )
}
