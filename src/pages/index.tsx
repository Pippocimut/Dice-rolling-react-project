import {RollCupPage} from "@/pages/main/RollCupPage.tsx";
import {Route, Routes} from "react-router-dom";
import {TagsPage} from "@/pages/tags";
import {HistoryPage} from "@/pages/history";
import {CreateButtonPage} from "@/pages/create-button";
import EditButtonPage from "@/pages/edit-button";
import {ExporPage} from "@/pages/export";
import {ConnectPage} from "@/pages/connect";
import {Header} from "@/components/Header.tsx";

export function Main() {
    return (
        <div className={"flex flex-col items-stretch bg-background min-h-screen justify-start"}>
            <Header/>
            <Routes>
                <Route path={"/"} element={<RollCupPage/>}/>
                <Route path={"/history"} element={<HistoryPage/>}/>
                <Route path={"/tags"} element={<TagsPage/>}/>
                <Route path={"/button/edit"} element={<EditButtonPage/>}/>
                <Route path={"/button/create"} element={<CreateButtonPage/>}/>
                <Route path={"/export"} element={<ExporPage/>}/>
                <Route path={"/connect"} element={<ConnectPage/>}/>
            </Routes>
        </div>
    );
}
