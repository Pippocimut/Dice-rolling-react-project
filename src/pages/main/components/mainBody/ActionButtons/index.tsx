import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {CreateButtonButton} from "@/pages/main/components/mainBody/ActionButtons/CreateButtonButton.tsx";
import {ToggleEditModeButton} from "@/pages/main/components/mainBody/ActionButtons/ToggleEditModeButton.tsx";

export function ActionButtons() {
    const currentSet = useSelector((state: RootState) => state.buttonSet.sets[state.selected.selectedSetId])
    const areThereButtons = !((Object.values(currentSet.buttonList ?? {}).length ?? 0) === 0)

    return <div
        className={"flex flex-row flex-wrap items-center justify-center w-fit gap-8"}>
        {areThereButtons && <ToggleEditModeButton/>}
        <CreateButtonButton/>
    </div>

}