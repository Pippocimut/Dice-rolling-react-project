import {Button} from "@/components/ui/button.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useRolls} from "@/pages/main/components/mainBody/dialogs/forms/RollForms/hooks/useRolls.tsx";

export const RollTriggerSelection = () => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    const { handleOnRollToggle } = useRolls()

    if (!roll) return null

    const isOnRoll = Boolean(roll.onRoll)
    const buttonText = isOnRoll ? "On-Roll: Active" : "On-Roll: Inactive"
    const buttonColorClass = isOnRoll
        ? "bg-emerald-600 text-white hover:bg-emerald-500"
        : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"

    return (
        <Button
            variant="secondary"
            className={`w-fit ${buttonColorClass}`}
            onClick={handleOnRollToggle}
            role="checkbox"
            aria-checked={isOnRoll}
            aria-label="Toggle on-roll behavior"
        >
            {buttonText}
        </Button>
    )
}