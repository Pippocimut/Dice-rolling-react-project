import TagsSideBar from "./components/sidebars/TagsSidebar.tsx";
import MainBody from "./components/mainBody/index.tsx";
import HistorySideBar from "./components/sidebars/HistorySidebar.tsx";
import {useContext, useEffect} from "react";
import {SocketContext} from "../../context/SocketContext.ts";

export function Main() {

    const {connect} = useContext(SocketContext)
    useEffect(() => {
        connect("roomName")
    }, []);

    return (
        <div className={"flex flex-row h-screen w-full justify-start items-start"}>
            <TagsSideBar/>
            <MainBody/>
            <HistorySideBar/>
        </div>
    );
}
