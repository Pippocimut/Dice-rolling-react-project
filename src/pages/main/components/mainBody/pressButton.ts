import { addRoll, type ButtonPressRecord, type TriggerResult } from "@/store/historySidebarSlice.ts";
import type { ButtonData, Trigger } from "@/store/button-sets/buttonSetSlice.ts";
import type { AppThunk } from "@/store";
import type { Enqueue, ResolveTrigger } from "../../../../components/TriggerRegistry/triggerRegistry.tsx";
import { executeTrigger } from "../../../../components/TriggerRegistry/triggerRegistry.tsx";

// Each queue slot carries the trigger and the resolver scoped to its own button.
// This means two buttons can both have a trigger with ID 1 and they will never
// interfere — the resolver attached at enqueue time is always the right one.
type QueuedItem = {
    trigger: Trigger;
    resolveTrigger: ResolveTrigger;
};

export const pressButton = (
    buttonData: ButtonData,
    username: string
): AppThunk<ButtonPressRecord> =>
    (dispatch, _getState) => {
        const results: TriggerResult[] = [];

        const queue: QueuedItem[] = [];
        const enqueue: Enqueue = (trigger, resolveTrigger) =>
            queue.push({ trigger, resolveTrigger });

        // Resolver for the pressed button — used for the initial pass and
        // passed into each handler so side effects resolve against the right map.
        const resolveForButton: ResolveTrigger = (id) => buttonData.triggers[id];

        // First pass: all on-roll triggers from the pressed button
        for (const trigger of Object.values(buttonData.triggers).filter((t) => t.onRoll)) {
            results.push(dispatch(executeTrigger(trigger, resolveForButton, enqueue)));
        }

        // Subsequent passes: each item already carries its own resolver,
        // so cross-button triggers work without any extra lookup
        let currentQueue = queue.splice(0);

        while (currentQueue.length > 0) {
            const nextQueue: QueuedItem[] = [];
            const enqueueNext: Enqueue = (trigger, resolveTrigger) =>
                nextQueue.push({ trigger, resolveTrigger });

            for (const { trigger, resolveTrigger } of currentQueue) {
                results.push(dispatch(executeTrigger(trigger, resolveTrigger, enqueueNext)));
            }

            currentQueue = nextQueue;
        }

        const roll: ButtonPressRecord = {
            id: 0,
            username,
            name: buttonData.name,
            color: buttonData.color,
            tag: buttonData.tag,
            date: new Date().toLocaleString(),
            rollResult: results,
        };

        dispatch(addRoll(roll));
        return roll;
    };
