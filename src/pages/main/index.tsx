import {ExportNav} from "@/pages/main/components/NavHeader/ExportNav.tsx";
import {ConnectNav} from "@/pages/main/components/NavHeader/ConnectNav.tsx";
import {ManageTags} from "@/pages/main/components/mainBody/Tags/ManageTags.tsx";
import {SetSelect} from "@/pages/main/components/NavHeader/SetSelect.tsx";
import {ImportNav} from "@/pages/main/components/NavHeader/ImportNav.tsx";
import {RollCupPage} from "@/pages/main/RollCupPage.tsx";
import {Route, Routes, useNavigate} from "react-router-dom";
import {HistoryPage} from "@/pages/main/HistoryPage.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AudioToggle} from "@/pages/main/components/NavHeader/AudioToggle.tsx";

export function Main() {

    const navigate = useNavigate();
    return (
        <div className={"flex flex-col items-stretch h-screen bg-background justify-start"}>
            <div
                className={"h-fit w-full px-8 py-4 border-b-2 border-borders gap-4 flex flex-row justify-start items-start flex-wrap"}>
                <Button onClick={() => navigate("/")}>
                    Home
                </Button>
                <Button onClick={() => navigate("/history")} >
                    History
                </Button>
                <ExportNav/>
                <ImportNav/>
                <ConnectNav/>
                <ManageTags/>
                <SetSelect/>
            </div>
            <Routes>
                <Route path={"/"} element={<RollCupPage/>}/>
                <Route path={"/history"} element={<HistoryPage/>}/>
            </Routes>
        </div>
    );
}