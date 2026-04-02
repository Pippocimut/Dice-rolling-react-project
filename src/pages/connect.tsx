import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useState} from "react";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {SocketContext} from "@/context/SocketContext.ts";
import {useNavigate} from "react-router-dom";

const SOCKET_SERVER_URL = 'https://socket-dice-server-819188550192.europe-west1.run.app';

export function ConnectPage() {
    const selectedRoomName = useSelector((state: RootState) => state.socket.roomName)
    const selectedUserName = useSelector((state: RootState) => state.socket.userName)

    const [roomName, setRoomName] = useState(selectedRoomName);
    const [userName, setUserName] = useState(selectedUserName);
    const navigate = useNavigate();

    const [rooms, setRooms] = useState<string[]>([])

    const getRooms = async () => {
        const response = await fetch(SOCKET_SERVER_URL + "/rooms")
        const data = await response.json()
        setRooms(data)
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

    const {connect, disconnect} = useContext(SocketContext);

    return (<div className="my-16 flex flex-col gap-8 overflow-hidden transition-all bg-invisible duration-300 mx-auto w-1/3">
            <div className={"flex flex-row justify-center text-xl font-bold"}>
                {selectedRoomName && <h2 className={"text-center"}>Connected to room: {selectedRoomName}</h2>}
                {!selectedRoomName && <h2 className={"text-center"}>Not connected to any room</h2>}
            </div>
            <div className={"flex flex-col flex-wrap gap-4"}>
                <div className={"flex flex-row flex-wrap gap-4"}>
                    <Label className={"px-2"}> Username </Label>
                    <Input
                        className="w-40 p-4 ml-auto"
                        type="text" placeholder="Username" value={userName}
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}/>
                </div>
                <div className={"flex flex-row flex-wrap gap-4"}>
                    <Label className={"px-2"}> Room ID </Label>
                    <Input type="text" placeholder="Room ID" value={roomName}
                           className="w-40 p-4 ml-auto"
                           onChange={(e) => setRoomName(e.target.value)}/>

                </div>

                {(rooms.length > 0) && <div className="flex flex-row gap-4 w-full flex-wrap">
                    <Label className={"px-2"}>
                        Available rooms
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-40 p-4 ml-auto">
                                {selectedRoomName?.trim().length ?? 0 > 0 ? selectedRoomName : "None selected"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-20">
                            <DropdownMenuRadioGroup value={roomName} onValueChange={(e) => setRoomName(e)}>
                                {rooms.map((roomName, index) => {
                                    return <DropdownMenuRadioItem key={index}
                                                                  value={roomName}
                                                                  className={roomName + " h-8 rounded-none cursor-pointer"}>
                                        {roomName}
                                    </DropdownMenuRadioItem>
                                })}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>}
            </div>
            <div className={"flex flex-row gap-4 w-full justify-between"}>
                <Button variant={"destructive"} onClick={() => {
                    disconnect();
                }}>
                    Disconnect
                </Button>
                <Button variant={"outline"} onClick={() => {
                    if (connect) {
                        if (!userName || userName?.length == 0)
                            alert("Please enter a username")
                        else if (!roomName || roomName?.length == 0)
                            alert("Please enter a room name")
                        else {
                            connect(roomName, userName);
                            setRoomName(roomName)
                            setUserName(userName)
                            navigate("/")
                        }
                    }
                }}>
                    Connect or create room
                </Button>
            </div>
        </div>
    )
}
