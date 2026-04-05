import { selectCurrentButton, selectCurrentTrigger, selectCurrentTriggerPath, setTrigger, type Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { TRIGGER_REGISTRY } from "@/components/trigger-registry/triggerRegistry";

export const useTriggers = () => {
    const trigger = useSelector(selectCurrentTrigger)!;
    const triggerPath = useSelector(selectCurrentTriggerPath)!
    const button = useSelector(selectCurrentButton);

    const triggers = button?.triggers ?? {};
    const dispatch = useDispatch();

    const updateRoll = (trigger: Trigger) => dispatch(setTrigger({ trigger, triggerPath }));

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRoll({ ...trigger, name: e.target.value });
    };

    const handleOnRollToggle = () => {
        updateRoll({ ...trigger, onRoll: !trigger.onRoll });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (trigger.type !== "text") return;
        updateRoll({ ...trigger, text: e.target.value });
    };

    /**
     * Switch trigger type. The registry's defaultData preserves any type-compatible
     * fields from the current trigger (e.g. switching back to roll keeps equations).
     * No explicit branching needed here — add a new type to the registry and this
     * function handles it automatically.
     */
    const handleTriggerTypeChange = (type: Trigger["type"]) => {
        const base = { id: trigger.id, name: trigger.name, onRoll: trigger.onRoll };
        updateRoll(TRIGGER_REGISTRY[type].defaultData(base, trigger));
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
