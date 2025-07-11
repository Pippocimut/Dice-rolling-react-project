import {createContext} from 'react';
import type {ButtonPressRecord} from "../store/history-sidebar/historySidebarSlice.ts";
import type {Socket} from "socket.io-client";

export type SocketContextType = {
    socket: Socket | null,
    connect: (roomName: string,userName:string) => void,
    disconnect: () => void,
    emitRoll: (data: ButtonPressRecord) => void,
}

export const SocketContext = createContext<SocketContextType>({
    socket: null,
    connect: (roomName: string, userName:string) => {
        console.log(`connecting: ${userName} to room:  ${roomName}`);
    },
    disconnect: () => {
    },
    emitRoll: (data: ButtonPressRecord) => {
        console.log("emit roll: " + data);
    },
});