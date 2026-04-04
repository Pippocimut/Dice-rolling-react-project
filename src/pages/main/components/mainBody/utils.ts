import { type ButtonSet, type TriggersMap } from "@/store/button-sets/buttonSetSlice.ts";
import type { TriggerResult } from "@/store/historySidebarSlice.ts";
import { executeTrigger } from "./triggerRegistry.tsx";

export function getSortedTags(buttonSet: ButtonSet) {
    const tagCounts = Object.values(buttonSet.buttonList).reduce((counts, button) => {
        if (!button) return counts;
        if (button.tag !== undefined && button.tag !== null && button.tag !== -1) {
            counts[button.tag] = (counts[button.tag] || 0) + 1;
        }
        return counts;
    }, {} as Record<number, number>);

    return [...(Object.values(buttonSet.tags) || [])].sort(
        (a, b) => (tagCounts[b.id] || 0) - (tagCounts[a.id] || 0)
    );
}

export function calculateOnRollTriggers(triggers: TriggersMap) {
    const triggersQueue: number[] = [];
    const queue = (id: number) => triggersQueue.push(id);

    const results: TriggerResult[] = Object.values(triggers)
        .filter((t) => t.onRoll)
        .map((t) => executeTrigger(t, queue));

    console.log("first roll results", results);
    console.log("first roll trigger queue", triggersQueue);

    return { results, triggersQueue };
}

export function calculateButtonRoll(rolls: TriggersMap, triggerQueue: number[]) {
    const newTriggerQueue: number[] = [];
    const queue = (id: number) => newTriggerQueue.push(id);

    const results: TriggerResult[] = Object.values(rolls)
        .filter((r) => triggerQueue.includes(r.id))
        .map((r) => executeTrigger(r, queue));

    return { results, triggerQueue: newTriggerQueue };
}
