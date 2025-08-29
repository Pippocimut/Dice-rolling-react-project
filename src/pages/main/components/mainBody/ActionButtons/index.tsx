import { useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonButton} from "@/pages/main/components/mainBody/ActionButtons/CreateButtonButton.tsx";
import {ToggleEditModeButton} from "@/pages/main/components/mainBody/ActionButtons/ToggleEditModeButton.tsx";

export function ActionButtons() {
    const buttonSets = useSelector((state: RootState) => state.buttonSet.sets)
    const selectedSetId = useSelector((state: RootState) => state.selected.selectedSetId)
    const areThereButtons = !((buttonSets?.find((buttonSet) => buttonSet.id == selectedSetId)?.buttonList?.length ?? 0) === 0)

    return <div
        className={"flex flex-row flex-wrap items-center justify-center w-fit gap-8"}>
        {areThereButtons && <ToggleEditModeButton/>}
        <CreateButtonButton/>
    </div>

}