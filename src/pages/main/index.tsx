import TagsSideBar from "./components/sidebars/TagsSidebar.tsx";
import MainBody from "./components/mainBody/index.tsx";
import HistorySideBar from "./components/sidebars/HistorySidebar.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../store";
import {useContext, useEffect} from "react";
import {SocketContext} from "../../context/SocketContext.ts";

export function Main() {
    const {roomName, userName} = useSelector((state:RootState) => state.socket);
    const {connect} = useContext(SocketContext)
    useEffect(() => {
        if(roomName && userName)
            connect(roomName,userName)
    },[])

    return (
        <div className={"flex items-stretch min-h-screen bg-background-color flex-row justify-start"}>
            <TagsSideBar/>
            <MainBody/>
            <HistorySideBar/>
        </div>
    );
}
