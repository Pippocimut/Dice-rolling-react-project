import type { ButtonTrigger } from "@/store/button-sets/buttonSetSlice";
import type { TriggerHandler, ResolveTrigger } from "../triggerRegistry";
import type { ButtonTriggerResult } from "@/store/historySidebarSlice";
import { ButtonTriggerEditor } from "./ButtonTriggerEditor";
import { ButtonTriggerCard } from "./ButtonTriggerCard";

export const buttonTriggerHandler: TriggerHandler<ButtonTrigger> = {
    label: "Button",

    defaultData: (base) => ({
        ...base,
        type: "button",
        targetButtonId: -1,
    } satisfies ButtonTrigger),

    EditorComponent: ButtonTriggerEditor,
    CardComponent: ButtonTriggerCard,

    execute: (trigger, _resolveTrigger, enqueue) => (_dispatch, getState): ButtonTriggerResult => {
        const { sets, selectedSetId } = getState().buttonSet;
        const targetButton = sets[selectedSetId].buttonList[trigger.targetButtonId];

        if (targetButton) {
            // Build a resolver scoped to the target button's trigger map.
            // This is passed alongside each queued trigger so that when those
            // triggers fire their own side effects, IDs resolve correctly
            // against the target button — not the button that started the press.
            const resolveTarget: ResolveTrigger = (id) => targetButton.triggers[id];

            Object.values(targetButton.triggers)
                .filter((t) => t.onRoll)
                .forEach((t) => enqueue(t, resolveTarget));
        }

        return {
            type: "button",
            name: trigger.name,
            targetButtonName: targetButton?.name ?? "Unknown",
        };
    },
};
