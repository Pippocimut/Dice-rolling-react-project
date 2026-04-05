import type { ButtonTrigger } from "@/store/button-sets/buttonSetSlice";
import { makePath } from "@/store/button-sets/paths";
import { resolveEntity } from "@/store/button-sets/resolveEntity";
import type { TriggerHandler } from "../triggerRegistry";
import type { ButtonTriggerResult } from "@/store/historySidebarSlice";
import { ButtonTriggerEditor } from "./ButtonTriggerEditor";
import { ButtonTriggerCard } from "./ButtonTriggerCard";

export const buttonTriggerHandler: TriggerHandler<ButtonTrigger> = {
    label: "Button",

    defaultData: (base) => ({
        ...base,
        type: "button",
        target: null,
    } satisfies ButtonTrigger),

    EditorComponent: ButtonTriggerEditor,
    CardComponent: ButtonTriggerCard,

    execute: (trigger, _resolveTrigger, enqueue) => (_dispatch, getState): ButtonTriggerResult => {
        if (!trigger.target) {
            return { type: "button", name: trigger.name, targetButtonName: "None" };
        }

        const targetButton = resolveEntity(getState(), trigger.target);

        if (targetButton) {
            Object.values(targetButton.triggers)
                .filter((t) => t.onRoll)
                .forEach((t) => {
                    const path = makePath.trigger(
                        trigger.target![0].id,
                        trigger.target![1].id,
                        t.id
                    );
                    enqueue(t, path);
                });
        }

        return {
            type: "button",
            name: trigger.name,
            targetButtonName: targetButton?.name ?? "Unknown",
        };
    },
};
