import type { RollTrigger, TextTrigger, Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setRoll } from "@/store/buttonManageSlice.ts";

export const useRolls = () => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger)
    const button = useSelector((state: RootState) => state.buttonManage.button)
    const triggers = button?.triggers ?? {};
    const dispatch = useDispatch()

    const updateRoll = (updatedRoll: Trigger) => {
        dispatch(setRoll(updatedRoll))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({ ...roll, name: e.target.value });
    };

    const handleOnRollToggle = () => {
        updateRoll({ ...roll, onRoll: !roll.onRoll });
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (roll.type !== "text") return
        updateRoll({ ...roll, text: e.target.value });
    }

    const handleTriggerTypeChange = (type: "roll" | "text") => {
        if (type === "roll") {
            updateRoll({
                id: roll.id,
                name: roll.name,
                type: "roll",
                onRoll: roll.type === "roll" ? roll.onRoll : true,
                nextEquationId: roll.type === "roll" ? roll.nextEquationId : 2,
                equations: roll.type === "roll" ? roll.equations : {}
            } as RollTrigger);
        } else {
            updateRoll({
                id: roll.id,
                name: roll.name,
                onRoll: roll.type === "roll" ? roll.onRoll : true,
                type: "text",
                text: roll.type === "text" ? roll.text : ""
            } as TextTrigger);
        }
    }

    return {
        triggers,
        button,
        handleTextChange,
        handleNameChange,
        handleOnRollToggle,
        handleTriggerTypeChange
    }
}