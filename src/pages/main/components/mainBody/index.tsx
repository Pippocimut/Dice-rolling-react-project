import {useCallback, useState, useRef, useEffect, useContext} from "react";
import ButtonList from "./ButtonList.tsx";
import CreateButtonForm from "./dialogs/forms/ButtonForm.tsx";
import DefaultDialog from "./dialogs/DefaultDialog.tsx";
import ExportDisplay from "./dialogs/forms/export-select-form";
import {toast} from "react-toastify";
import {
    addNewSet,
    type ButtonData,
    type ButtonSet,
    type Tag,
    updateButtonSets
} from "../../../../store/button-sets/buttonSetSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../store";
import {SocketContext} from "../../../../context/SocketContext.ts";
import {emitUserName} from "../../../../store/socket/socketSlice.ts";

const MainBody = () => {
    const dispatch = useDispatch();

    const {roomName: roomNameFromStore, userName: userNameFromStore} = useSelector((state: RootState) => state.socket)

    const [roomName, setRoomName] = useState("Default");

    const {connect} = useContext(SocketContext);

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedTag = useSelector((state: RootState) => state.selected.selectedTag)
    const selectedSet = useSelector((state: RootState) => state.selected.selectedSet)

    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null);

    const exportLinkRef = useRef<HTMLAnchorElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Create link if it doesn't exist yet
        if (!exportLinkRef.current) {
            const link = document.createElement('a');
            link.download = 'buttons.json';
            link.style.display = 'none'; // Hide the link
            document.body.appendChild(link);
            exportLinkRef.current = link;
        }

        return () => {
            if (exportLinkRef.current) {
                document.body.removeChild(exportLinkRef.current);
                exportLinkRef.current = null;
            }
        };
    }, []);

    const removeButton = useCallback(
        (index: number,) => {
            const indexOfButtonSet = buttonSets.findIndex((setObject: ButtonSet) => setObject.name === selectedSet)
            const newButtonList = buttonSets[indexOfButtonSet].buttonList.filter((_: object, i: number) => i !== index)
            dispatch(updateButtonSets(newButtonList));
            setIsOpenEditDialog(false);
            setSelectedButtonIndex(null);
        },
        [buttonSets]
    );

    const editButton = useCallback((index: number) => {
        setSelectedButtonIndex(index);
        setIsOpenEditDialog(true);
    }, []);

    const exportAll = useCallback((tags: number[], buttons: number[], setName: string) => {

        if (!exportLinkRef.current) return;

        const buttonListExport = buttonSets.reduce((acc: ButtonData[], set) => {
            acc.push(...set.buttonList.filter((button: ButtonData) => buttons.includes(button.id)))
            return acc
        }, [])

        const tagsExport = buttonSets.reduce((acc: Tag[], set) => {
            acc.push(...set.tags.filter((tag: Tag) => tags.includes(tag.id)))
            return acc
        }, [])

        const exportSet = {
            name: setName,
            buttonList: buttonListExport,
            tags: tagsExport
        }

        const jsonData = JSON.stringify(exportSet, null, 2);
        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        exportLinkRef.current.href = url;
        exportLinkRef.current.click();

        URL.revokeObjectURL(url);
    }, [buttonSets]);

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                dispatch(addNewSet(importedData))

            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const importAll = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);


    return (
        <div
            className={
                "flex flex-col h-full gap-20 w-full items-center justify-around"
            }
        >
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelected}
                style={{display: 'none'}}
            />

            <div className={"flex flex-col gap-20"}>
                <div className={"flex flex-col gap-4 w-full"}>
                    <h2 className={"text-4xl font-bold"}>
                        Current Room: {roomNameFromStore}
                    </h2>
                    <label className={"text-2xl"}>
                        Your Name: {userNameFromStore}
                    </label>
                    <input
                        className={"w-fit border-2 border-gray-300 rounded-2xl p-4 mx-auto"}
                        type={"text"} placeholder={"Enter a room name"} value={userNameFromStore} onChange={(e) => {
                        dispatch(emitUserName(e.target.value))
                    }}/>
                </div>


                <div className={"flex flex-row items-center justify-center gap-20 w-full"}>
                    <button className={"w-fit border-2 border-gray-300 rounded-2xl p-4"} onClick={() => {
                        if (buttonSets.length === 0)
                            toast.error("You must have at least one button to export")
                        else
                            setIsDialogOpen(true)
                    }}>
                        Export
                    </button>
                    <button className={"w-fit border-2 border-gray-300 rounded-2xl p-4"} onClick={importAll}>
                        Import
                    </button>
                    <div className={"w-fit border-2 border-gray-300 rounded-2xl p-4"}>

                        <input type={"text"} placeholder={"Enter a room name"} value={roomName}
                               onChange={(e) => setRoomName(e.target.value)}/>
                        <button onClick={() => {
                            if (connect) {
                                connect(roomName);
                            }
                        }}>
                            Connect to room
                        </button>
                    </div>
                </div>
            </div>

            <ButtonList
                buttonSetName={selectedSet || "Default"}
                selectedTag={selectedTag}
                removeButton={removeButton}
                editButton={editButton}
                openCreateDialog={() => setIsOpenCreateDialog(true)}
            />

            <DefaultDialog
                isOpen={isOpenCreateDialog}
                onClose={() => {
                    setIsOpenCreateDialog(false);
                }}
            >
                <CreateButtonForm
                    mode={"create"}
                    close={() => setIsOpenCreateDialog(false)}
                    selectedTag={selectedTag}
                    selectedSetName={selectedSet!}
                />
            </DefaultDialog>

            <DefaultDialog
                isOpen={isOpenEditDialog}
                onClose={() => {
                    setIsOpenEditDialog(false);
                }}
            >
                {selectedButtonIndex !== null && (
                    <CreateButtonForm
                        mode={"edit"}
                        close={() => {
                            setSelectedButtonIndex(-1)
                            setIsOpenEditDialog(false)
                        }}
                        selectedButtonIndex={selectedButtonIndex}
                        selectedSetName={selectedSet!}
                    />
                )}
            </DefaultDialog>

            <DefaultDialog isOpen={isDialogOpen} onClose={() => {
                setIsDialogOpen(false)
            }}>
                <ExportDisplay close={() => setIsDialogOpen(false)} exportData={exportAll}/>
            </DefaultDialog>
        </div>
    );
};

export default MainBody;