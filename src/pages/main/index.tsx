import MainBody from "./components/mainBody/index.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "@/context/SocketContext.ts";
import {SetSelect} from "@/pages/main/components/mainBody/SetSelect.tsx";
import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/pages/main/components/mainBody/dialogs/DefaultDialog.tsx";
import {Settings} from "@/pages/main/components/mainBody/Settings.tsx";
import {Connect} from "@/pages/main/components/mainBody/Connect.tsx";
import RollHistoryPanel from "@/pages/main/components/mainBody/RollHistoryPanel.tsx";
import {ManageTags} from "@/pages/main/components/mainBody/ManageTags.tsx";

export function Main() {
    const {roomName, userName} = useSelector((state: RootState) => state.socket);
    const {connect} = useContext(SocketContext)
    useEffect(() => {
        if (roomName && userName)
            connect(roomName, userName)
    }, [])

    const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
    const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

    return (
        <div className={"flex items-stretch min-h-screen bg-background flex-col justify-start"}>
            <div
                className={"h-fit w-full px-8 py-4 border-b-2 border-borders gap-4 flex flex-row justify-start items-start flex-wrap"}>
                <Button onClick={() => setIsSettingsDialogOpen(true)}>Export/Import</Button>
                <Button onClick={() => setIsConnectDialogOpen(true)}>Connect</Button>
                <Button onClick={() => setIsHistoryDialogOpen(true)}>History</Button>
                <ManageTags/>
                <SetSelect/>
            </div>
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
            <DefaultDialog
                isOpen={isHistoryDialogOpen}
                onClose={() => {
                    setIsHistoryDialogOpen(false);
                }}
            >
                <RollHistoryPanel/>
            </DefaultDialog>
            <MainBody/>
        </div>
    );
}