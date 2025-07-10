import {useContext, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import type {RootState} from "../../../../../store";
import {SocketContext} from "../../../../../context/SocketContext.ts";

export function Connect() {
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

    const [roomName, setRoomName] = useState("");
    const [userName, setUserName] = useState("");

    const [rooms, setRooms] = useState<string[]>([])

    const getRooms = async () => {
        try{
            const response = await fetch("http://localhost:3000/rooms")
            const data = await response.json()
            setRooms(data)
        }catch(e){
        }
    }

    useEffect(() => {
        getRooms()

        const intervalId = setInterval(() => {
            getRooms()
        }, 10000)

        return () => {
            clearInterval(intervalId)
        }

    }, [])

    const {roomName: roomNameFromStore, userName: userNameFromStore} = useSelector((state: RootState) => state.socket)
    const {connect} = useContext(SocketContext);

    return (
        <div className="w-full mt-auto p-4">
            <button
                className="w-full flex justify-between items-center px-4 py-2 text-xl font-medium rounded-md focus:outline-none"
                onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            >
                <h2 className="text-xl text-left">Connect</h2>
                <svg
                    className={`w-5 h-5 ml-2 transform transition-transform ${isSettingsExpanded ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"/>
                </svg>
            </button>

            <div
                className={`mt-2 overflow-hidden transition-all bg-invisible duration-300 ease-in-out ${
                    isSettingsExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col gap-4 rounded-md">
                    <div className="flex flex-col gap-4 w-full">
                        <p className="text-xl">
                            Your Name: <span className={"font-bold"}>{userNameFromStore || "Is missing"}</span>
                        </p>
                        <p className="text-xl w-full">
                            Are connected to: <span
                            className={"font-bold"}>{roomNameFromStore?.length ?? 0 > 0 ? ` ${roomNameFromStore}` : "no room"}</span>
                        </p>
                        <div className={"flex flex-row flex-wrap gap-4"}>
                            <input
                                className="w-40 border-2 border-gray-300 rounded-2xl p-4 mx-auto"
                                type="text" placeholder="Username" value={userName}
                                onChange={(e) => {
                                    if (e.target.value.length == 0)
                                        setUserName("Guest")
                                    else
                                        setUserName(e.target.value)
                                }}/>
                            <input type="text" placeholder="Room ID" value={roomName}
                                   className="w-40 border-2 border-gray-300 rounded-2xl p-4 mx-auto"
                                   onChange={(e) => setRoomName(e.target.value)}/>
                        </div>
                        <button onClick={() => {
                            if (connect) {
                                if (userName.length == 0)
                                    alert("Please enter a username")
                                else if (roomName.length == 0)
                                    alert("Please enter a room name")
                                else
                                    connect(roomName, userName);
                            }
                        }}
                                className="w-full rounded-2xl p-4 border-2 border-gray-300">
                            Connect or create room
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <p className="text-xl">
                            Available rooms:
                        </p>
                        <div className="flex flex-col gap-4 w-full">
                            {rooms.map((room,index) => {
                                return (
                                    <p key={index}> {room}</p>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

