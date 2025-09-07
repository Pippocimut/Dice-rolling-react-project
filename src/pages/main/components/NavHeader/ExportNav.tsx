import {Button} from "@/components/ui/button.tsx";
import DefaultDialog from "@/components/DefaultDialog.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useCallback, useEffect, useRef, useState} from "react";
import type {ButtonData, Tag} from "@/store/button-sets/buttonSetSlice.ts";
import ExportDisplay from "@/pages/main/components/mainBody/dialogs/forms/export-select-form";
import {toast} from "react-toastify";

export function ExportNav() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const currentExportVersion = useSelector((state: RootState) => state.buttonSet.currentVersion)
    const exportLinkRef = useRef<HTMLAnchorElement | null>(null);
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

        const buttonListExport = Object.values(buttonSets).reduce((acc: Record<number, ButtonData>, set) => {
            buttons.forEach((buttonId) => {
                if (set.buttonList[buttonId]) {
                    acc[buttonId] = set.buttonList[buttonId]
                }
            })
            return acc
        }, {})

        const tagsExport = Object.values(buttonSets).reduce((acc: Record<number, Tag>, set) => {
            tags.forEach((tagId) => {
                if (set.tags[tagId]) {
                    acc[tagId] = set.tags[tagId]
                }
            })
            return acc
        }, {})

        const exportSet = {
            version: currentExportVersion,
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

    return <>
        <DefaultDialog isOpen={isDialogOpen} onClose={() => {
            setIsDialogOpen(false)
        }}>
            <ExportDisplay close={() => setIsDialogOpen(false)} exportData={exportAll}/>
        </DefaultDialog>
        <Button onClick={() => {
            if (Object.values(buttonSets).length === 0)
                toast.error("You must have at least one button to export")
            else
                setIsDialogOpen(true)
        }}>
            Export
        </Button>
    </>
}