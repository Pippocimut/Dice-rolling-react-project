import {Button} from "@/components/ui/button.tsx";
import {useCallback, useRef} from "react";
import {addNewSet} from "@/store/button-sets/buttonSetSlice.ts";
import {useDispatch} from "react-redux";

export function ImportNav() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()

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


    return <>
        <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelected}
            style={{display: 'none'}}
        />
        <Button onClick={importAll}>
            Import
        </Button>
    </>
}