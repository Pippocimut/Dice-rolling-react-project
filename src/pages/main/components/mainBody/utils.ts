import { type ButtonSet } from "@/store/button-sets/buttonSetSlice.ts";

export function getSortedTags(buttonSet: ButtonSet) {
    const tagCounts = Object.values(buttonSet.buttons).reduce((counts, button) => {
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
