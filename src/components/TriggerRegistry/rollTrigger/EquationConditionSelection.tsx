import {type Equation, type RollTrigger, type SideEffect} from "@/store/button-sets/buttonSetSlice.ts";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setRoll} from "@/store/buttonManageSlice.ts";
import {SideEffectConditionsV12} from "@/store/button-sets/ButtonSetV1.2.ts";

export const EquationConditionSelection = ({
                                             currentEquation,
                                             sideEffectId
                                         }: {
    currentEquation: Equation,
    sideEffectId: number,
}) => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    const dispatch = useDispatch()
    const updateRoll = (roll: RollTrigger) => {
        dispatch(setRoll(roll))
    }
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
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={currentSideEffect.condition || "None"}
                                        onValueChange={(e) => {
                                            const equations = {...roll.equations}
                                            equations[currentEquation.id] = {
                                                ...equations[currentEquation.id],
                                                sideEffects: {
                                                    ...equations[currentEquation.id].sideEffects,
                                                    [sideEffectId]: {
                                                        ...equations[currentEquation.id].sideEffects![sideEffectId],
                                                        condition: e
                                                    } as SideEffect
                                                }
                                            }
                                            updateRoll({
                                                ...roll,
                                                equations
                                            })

                                        }}>
                    {Object.values(conditionList).map((condition, index) => {
                        return <DropdownMenuRadioItem key={index} value={condition}>{condition}</DropdownMenuRadioItem>
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}