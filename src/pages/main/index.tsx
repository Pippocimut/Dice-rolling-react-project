import TagsSideBar from "./components/sidebars/TagsSidebar.tsx";
import MainBody from "./components/mainBody/index.tsx";
import HistorySideBar from "./components/sidebars/HistorySidebar.tsx";

export function Main() {

    return (
        <div className={"flex flex-row h-screen w-full justify-start items-start"}>
            <TagsSideBar/>
            <MainBody/>
            <HistorySideBar/>
        </div>
    );
}
