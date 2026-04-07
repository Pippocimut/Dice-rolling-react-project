import { type Equation, } from "@/store/button-sets/buttonSetSlice.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SideEffectConditionsV12 } from "@/store/button-sets/ButtonSetV1.2.ts";
import { useSideEffects } from "@/components/trigger-registry/rollTrigger/trigger-editor/equations/side-effects/hooks/useSideEffects";
import type { SideEffectConditionsTypeV13 } from "@/store/button-sets/ButtonSetV1.3";

export const SideEffectConditionSelection = ({
    currentEquation,
    sideEffectId
}: {
    currentEquation: Equation,
    sideEffectId: number,
}) => {
    const { handleConditionChange } = useSideEffects()

    const currentSideEffect = currentEquation?.sideEffects ? currentEquation?.sideEffects[sideEffectId] : undefined
    const conditionList = Object.values(SideEffectConditionsV12)

    if (currentSideEffect === undefined) return
    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild id={"tag-dropdown-menu-trigger"}>
                <Button variant="outline"
                    className={"w-fit"}>{currentSideEffect.condition ?? "None"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Trigger</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={currentSideEffect.condition || "None"}
                    onValueChange={(e) => {
                        handleConditionChange(currentEquation.id)(sideEffectId)(e as SideEffectConditionsTypeV13)
                    }}>
                    {Object.values(conditionList).map((condition, index) => {
                        return <DropdownMenuRadioItem key={index} value={condition}>{condition}</DropdownMenuRadioItem>
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}