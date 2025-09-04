import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useState} from "react";
import {
    Dialog, DialogClose, DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
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

const SOCKET_SERVER_URL = 'https://socket-dice-server-819188550192.europe-west1.run.app';


export function ConnectNav() {

    const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
    const selectedRoomName = useSelector((state: RootState) => state.socket.roomName)
    const selectedUserName = useSelector((state: RootState) => state.socket.userName)

    const [roomName, setRoomName] = useState(selectedRoomName);
    const [userName, setUserName] = useState(selectedUserName);

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

    return (
        <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
            <DialogTrigger>
                <Button onClick={() => setIsConnectDialogOpen(true)}>Connect</Button>
            </DialogTrigger>
            <DialogContent className="w-fit mt-auto p-4 bg-background text-text">
                <DialogHeader>
                    <DialogTitle>
                        Connect to room
                    </DialogTitle>
                    <DialogDescription className={"text-wrap flex flex-col"}>
                    <span>
                        Select a username to use and a room to join
                    </span>
                        <span>
                     (if no room with selected name exists it will create a new one with that name)
                    </span>
                    </DialogDescription>
                </DialogHeader>
                <div className={`mt-2 overflow-hidden transition-all bg-invisible duration-300 ease-in-out`}>
                    <div className="flex flex-col gap-4 rounded-md">
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
                                    Online rooms
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

                        <DialogFooter>
                            <DialogClose>
                                <Button variant={"destructive"} onClick={() => {
                                    disconnect();
                                }}>
                                    Disconnect
                                </Button>
                            </DialogClose>
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
                                        setIsConnectDialogOpen(false);
                                    }
                                }
                            }}>
                                Connect or create room
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
