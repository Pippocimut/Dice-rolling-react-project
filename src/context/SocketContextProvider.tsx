import {type ReactNode, useState} from 'react';
import {io, Socket} from 'socket.io-client';
import {SocketContext} from './SocketContext';
import {addRoll, type ButtonPressRecord} from "../store/history-sidebar/historySidebarSlice.ts";
import {useDispatch} from "react-redux";
import {emitRoomName} from "../store/socket/socketSlice.ts";

const SOCKET_SERVER_URL = 'https://socket-dice-server-819188550192.europe-west1.run.app';

export const SocketProvider = ({children}: { children: ReactNode }) => {

    const [socket, setSocket] = useState<Socket | null>(null);
    const dispatch = useDispatch()

    const connect = (roomName: string) => {
        // Disconnect existing connection if any
        if (socket) {
            socket.disconnect();
        }

        // Create new connection
        const newSocket = io(`${SOCKET_SERVER_URL}/?roomName=${roomName}`, {
            transports: ['websocket'],
        });

        newSocket.on("roll", (data: ButtonPressRecord) => {
            console.log("Received roll:")
            dispatch(addRoll(data))
        })

        setSocket(newSocket);
        dispatch(emitRoomName(roomName))
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    const emitRoll = (data: ButtonPressRecord) => {
        if (socket && socket.connected) {
            socket.emit("roll", data);
        }
    };

    const contextValue = {
        socket,
        connect,
        disconnect,
        emitRoll,
    }

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )
};