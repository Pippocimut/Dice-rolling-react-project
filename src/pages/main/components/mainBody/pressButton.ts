import { addRoll, type ButtonPressRecord, type TriggerResult } from "@/store/historySidebarSlice.ts";
import type { ButtonData } from "@/store/button-sets/buttonSetSlice.ts";
import type { AppThunk } from "@/store";
import { executeTrigger } from "./triggerRegistry.tsx";

/**
 * Thunk that executes a full button press: runs all on-roll triggers, then
 * iteratively processes any chained triggers until the queue is empty.
 *
 * Returns the completed ButtonPressRecord so the calling component can
 * forward it to the socket and toast without knowing about the execution loop.
 */
export const pressButton = (
    buttonData: ButtonData,
    username: string
): AppThunk<ButtonPressRecord> =>
    (dispatch, _getState) => {
        const results: TriggerResult[] = [];

        // First pass: all triggers marked onRoll fire immediately
        const triggerQueue: number[] = [];
        const enqueue = (id: number) => triggerQueue.push(id);

        for (const trigger of Object.values(buttonData.triggers).filter((t) => t.onRoll)) {
            results.push(dispatch(executeTrigger(trigger, enqueue)));
        }

        // Subsequent passes: drain the queue until no more chained triggers
        let currentQueue = triggerQueue.splice(0);

        while (currentQueue.length > 0) {
            const nextQueue: number[] = [];
            const enqueueNext = (id: number) => nextQueue.push(id);

            for (const id of currentQueue) {
                const trigger = buttonData.triggers[id];
                if (!trigger) continue;
                results.push(dispatch(executeTrigger(trigger, enqueueNext)));
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
