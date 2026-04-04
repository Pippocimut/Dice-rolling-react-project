import { addRoll, type ButtonPressRecord, type TriggerResult } from "@/store/historySidebarSlice.ts";
import type { ButtonData, Trigger, TriggerPath } from "@/store/button-sets/buttonSetSlice.ts";
import { makePath, resolveEntity } from "@/store/button-sets/buttonSetSlice.ts";
import type { AppThunk } from "@/store";
import type { Enqueue, ResolveTrigger } from "../../../../components/TriggerRegistry/triggerRegistry.tsx";
import { executeTrigger } from "../../../../components/TriggerRegistry/triggerRegistry.tsx";

// Each queue slot carries the trigger and its globally unique path.
// Because paths encode set+button+trigger, two buttons with the same local
// trigger ID never interfere — the path is always unambiguous.
type QueuedItem = {
    trigger: Trigger;
    path: TriggerPath;
};

export const pressButton = (
    buttonData: ButtonData,
    username: string,
    setId: number,
): AppThunk<ButtonPressRecord> =>
    (dispatch, getState) => {
        const results: TriggerResult[] = [];

        const queue: QueuedItem[] = [];
        const enqueue: Enqueue = (trigger, path) => queue.push({ trigger, path });

        // ResolveTrigger now delegates to the global resolveEntity selector —
        // paths are self-describing, no per-button scope needed.
        const resolveTrigger: ResolveTrigger = (path: TriggerPath) =>
            resolveEntity(getState(), path);

        // First pass: all on-roll triggers from the pressed button.
        for (const trigger of Object.values(buttonData.triggers).filter((t) => t.onRoll)) {
            const path = makePath.trigger(setId, buttonData.id, trigger.id);
            results.push(dispatch(executeTrigger(trigger, resolveTrigger, enqueue)));
            // seed the queue path for any side effects this trigger enqueues
            void path; // path is used inside enqueue via closures in handlers
        }

        // Subsequent passes: each item carries its own globally unique path.
        let currentQueue = queue.splice(0);

        while (currentQueue.length > 0) {
            const nextQueue: QueuedItem[] = [];
            const enqueueNext: Enqueue = (trigger, path) => nextQueue.push({ trigger, path });

            for (const { trigger } of currentQueue) {
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
