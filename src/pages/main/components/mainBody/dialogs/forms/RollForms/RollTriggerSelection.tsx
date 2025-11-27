import type {Trigger, TriggersMap} from "@/store/button-sets/buttonSetSlice.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useRolls} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useRolls.tsx";
import {defaultTriggers} from "@/store/button-sets/defaultTags.ts";

export const RollTriggerSelection = () => {
    const rollTriggerId = useSelector((state: RootState) => state.buttonManage.roll.trigger)
    const triggers: TriggersMap = {...defaultTriggers}

    const trigger: Trigger = triggers[rollTriggerId]
    const {
        handleTriggerChange
    } = useRolls()

    if (trigger === undefined) return null

    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={"equation-trigger-dropdown-menu-trigger"}>
                <Button variant="outline" className={"w-fit"}>{trigger.name}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trigger</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={trigger.id + ""} onValueChange={handleTriggerChange}>
                    {Object.values(triggers).map((currentTrigger) => {
                        const {id, name} = currentTrigger;
                        return <DropdownMenuRadioItem key={id} value={id + ""}>{name}</DropdownMenuRadioItem>
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}