import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../../../../store";
import {addNewSet, type ButtonData, type Tag} from "../../../../../store/button-sets/buttonSetSlice.ts";
import {toast} from "react-toastify";
import ExportDisplay from "../../mainBody/dialogs/forms/export-select-form";
import DefaultDialog from "../../mainBody/dialogs/DefaultDialog.tsx";

export function Settings() {

    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)

    const exportLinkRef = useRef<HTMLAnchorElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch()

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
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
        <div className="w-full mt-auto p-4">
            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelected}
                style={{display: 'none'}}
            />
            <DefaultDialog isOpen={isDialogOpen} onClose={() => {
                setIsDialogOpen(false)
            }}>
                <ExportDisplay close={() => setIsDialogOpen(false)} exportData={exportAll}/>
            </DefaultDialog>
            <div className="flex flex-col gap-4 px-4 rounded-md">
                <button className="w-full border-2 border-gray-300 rounded-2xl p-4" onClick={() => {
                    if (buttonSets.length === 0)
                        toast.error("You must have at least one button to export")
                    else
                        setIsDialogOpen(true)
                }}>
                    Export
                </button>
                <button className="w-full border-2 border-gray-300 rounded-2xl p-4"
                        onClick={importAll}>
                    Import
                </button>
            </div>
        </div>
    );
}
