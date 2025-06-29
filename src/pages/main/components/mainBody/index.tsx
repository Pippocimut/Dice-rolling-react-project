import {useCallback, useState, useRef, useEffect} from "react";
import {useButtonList} from "../../../../data/buttonListDAO.ts";
import type {Tag} from "../../../../data/tagsDAO.ts";
import ButtonList from "./ButtonList.tsx";
import CreateButtonForm from "./dialogs/forms/ButtonForm.tsx";
import ButtonDialog from "./dialogs/ButtonDialog.tsx";
import {useExportAll} from "../../../../data/exportAllDAO.ts";
import { useImportAll } from "../../../../data/importAllDAO.ts";

type Props = {
    selectedTag?: Tag;
};

const MainBody = ({selectedTag}: Props) => {
    const [buttonList, updateButtonList] = useButtonList();
    const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const exportAllData = useExportAll();
    const importAllData = useImportAll()
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
        (index: number) => {
            updateButtonList(
                buttonList.filter((_: object, i: number) => i !== index)
            );
            setIsOpenEditDialog(false);
            setSelectedButtonIndex(null);
        },
        [buttonList]
    );

    const editButton = useCallback((index: number) => {
        setSelectedButtonIndex(index);
        setIsOpenEditDialog(true);
    }, []);

    const exportAll = useCallback(() => {
        if (!exportLinkRef.current) return;

        const jsonData = JSON.stringify(exportAllData, null, 2);
        const blob = new Blob([jsonData], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        exportLinkRef.current.href = url;
        exportLinkRef.current.click();

        URL.revokeObjectURL(url);
    }, [exportAllData]);

    const handleFileSelected = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                importAllData(importedData)

            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

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
                style={{ display: 'none' }}
            />

            <div className={"flex flex-row items-center justify-center gap-20 w-full"}>
                <button className={"w-fit border-2 border-gray-300 rounded-2xl p-4"} onClick={exportAll}>
                    Export
                </button>
                <button className={"w-fit border-2 border-gray-300 rounded-2xl p-4"} onClick={importAll}>
                    Import
                </button>
            </div>

            <ButtonList
                buttonList={buttonList}
                selectedTag={selectedTag}
                removeButton={removeButton}
                editButton={editButton}
                openCreateDialog={() => setIsOpenCreateDialog(true)}
            />

            <ButtonDialog
                isOpen={isOpenCreateDialog}
                onClose={() => {
                    setIsOpenCreateDialog(false);
                }}
            >
                <CreateButtonForm
                    mode={"create"}
                    close={() => setIsOpenCreateDialog(false)}
                    selectedTag={selectedTag}
                />
            </ButtonDialog>

            <ButtonDialog
                isOpen={isOpenEditDialog}
                onClose={() => {
                    setIsOpenEditDialog(false);
                }}
            >
                {selectedButtonIndex !== null && (
                    <CreateButtonForm
                        mode={"edit"}
                        close={() => setIsOpenEditDialog(false)}
                        selectedButtonIndex={selectedButtonIndex}
                    />
                )}
            </ButtonDialog>
        </div>
    );
};

export default MainBody;