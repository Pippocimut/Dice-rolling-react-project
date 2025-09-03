import {ExportNav} from "@/pages/main/components/NavHeader/ExportNav.tsx";
import {ConnectNav} from "@/pages/main/components/NavHeader/ConnectNav.tsx";
import {HistoryNav} from "@/pages/main/components/NavHeader/HistoryNav.tsx";
import {ManageTags} from "@/pages/main/components/mainBody/ManageTags.tsx";
import {SetSelect} from "@/pages/main/components/mainBody/SetSelect.tsx";
import {MainInfo} from "@/pages/main/components/mainBody/MainInfo";
import {ActionButtons} from "@/pages/main/components/mainBody/ActionButtons";
import ButtonLists from "@/pages/main/components/mainBody/ButtonLists.tsx";
import {ImportNav} from "@/pages/main/components/NavHeader/ImportNav.tsx";

export function Main() {
    return (
        <div className={"flex flex-col items-stretch h-screen bg-background justify-start"}>
            <div className={"h-fit w-full px-8 py-4 border-b-2 border-borders gap-4 flex flex-row justify-start items-start flex-wrap"}>
                <ExportNav/>
                <ImportNav/>
                <ConnectNav/>
                <HistoryNav/>
                <ManageTags/>
                <SetSelect/>
            </div>
            <div className={"flex flex-col py-8 gap-4 w-full bg-background items-center"}>
                <MainInfo/>
                <ActionButtons/>
                <ButtonLists/>
            </div>
        </div>
    );
}