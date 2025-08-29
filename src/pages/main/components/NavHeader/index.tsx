import {ManageTags} from "@/pages/main/components/mainBody/ManageTags.tsx";
import {SetSelect} from "@/pages/main/components/mainBody/SetSelect.tsx";
import {ExpoImpoNav} from "@/pages/main/components/NavHeader/ExpoImpoNav.tsx";
import {ConnectNav} from "@/pages/main/components/NavHeader/ConnectNav.tsx";
import {HistoryNav} from "@/pages/main/components/NavHeader/HistoryNav.tsx";


export function NavHeader() {
    return <div className={"h-fit w-full px-8 py-4 border-b-2 border-borders gap-4 flex flex-row justify-start items-start flex-wrap"}>
            <ExpoImpoNav/>
            <ConnectNav/>
            <HistoryNav/>
            <ManageTags/>
            <SetSelect/>
        </div>
}