import {useCallback, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {addNewSet, setSelectedSet} from "@/store/button-sets/buttonSetSlice.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";

export const ImportButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch()
    const nextSetId = useSelector((state: RootState) => state.buttonSet.nextSetId)
    const navigate = useNavigate();

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                dispatch(addNewSet(importedData))
                dispatch(setSelectedSet(nextSetId))
            } catch (error) {
                console.error("Error parsing JSON file:", error);
            }
        };

        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        navigate("/")
    }

    const importAll = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    return <>
        <Button onClick={importAll} className={"p-4"}>
            Import Set
        </Button>
        <Input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelected}
            style={{display: 'none'}}
        />
    </>
}