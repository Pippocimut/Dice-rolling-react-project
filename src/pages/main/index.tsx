import MainBody from "./components/mainBody/index.tsx";
import {NavHeader} from "@/pages/main/components/NavHeader";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useContext, useEffect} from "react";
import {SocketContext} from "@/context/SocketContext.ts";

export function Main() {
    const {roomName, userName} = useSelector((state: RootState) => state.socket);
    const {connect} = useContext(SocketContext)
    useEffect(() => {
        if (roomName && userName)
            connect(roomName, userName)
    })

    return (
        <div className={"flex flex-col items-stretch h-screen bg-background justify-start"}>
            <NavHeader/>
            <MainBody/>
        </div>
    );
}