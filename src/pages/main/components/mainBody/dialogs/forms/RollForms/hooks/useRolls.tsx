import type { Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setRoll } from "@/store/buttonManageSlice.ts";
import { TRIGGER_REGISTRY } from "@/components/TriggerRegistry/triggerRegistry";

export const useRolls = () => {
    const roll = useSelector((state: RootState) => state.buttonManage.trigger);
    const button = useSelector((state: RootState) => state.buttonManage.button);
    const triggers = button?.triggers ?? {};
    const dispatch = useDispatch();

    const updateRoll = (updated: Trigger) => dispatch(setRoll(updated));

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({ ...roll, name: e.target.value });
    };

    const handleOnRollToggle = () => {
        updateRoll({ ...roll, onRoll: !roll.onRoll });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (roll.type !== "text") return;
        updateRoll({ ...roll, text: e.target.value });
    };

    /**
     * Switch trigger type. The registry's defaultData preserves any type-compatible
     * fields from the current trigger (e.g. switching back to roll keeps equations).
     * No explicit branching needed here — add a new type to the registry and this
     * function handles it automatically.
     */
    const handleTriggerTypeChange = (type: Trigger["type"]) => {
        const base = { id: roll.id, name: roll.name, onRoll: roll.onRoll };
        updateRoll(TRIGGER_REGISTRY[type].defaultData(base, roll));
    };

    return {
        triggers,
        button,
        handleTextChange,
        handleNameChange,
        handleOnRollToggle,
        handleTriggerTypeChange,
    };
};
