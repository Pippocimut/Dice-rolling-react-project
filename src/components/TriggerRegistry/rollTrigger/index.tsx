import type { RollTrigger } from "@/store/button-sets/buttonSetSlice";
import type { TriggerHandler } from "../triggerRegistry";
import { RollTriggerEditor } from "./RollTriggerEditor";
import { RollTriggerCard } from "./RollTriggerCard";
import { executeEquations } from "./Execute";
import type { RollTriggerResult } from "@/store/historySidebarSlice";


export const rollTriggerHandler: TriggerHandler<RollTrigger> = {
  label: "Roll",

  defaultData: (base, previous) => ({
    ...base,
    type: "roll",
    nextEquationId: previous?.type === "roll" ? previous.nextEquationId : 2,
    equations:
      previous?.type === "roll"
        ? previous.equations
        : { 1: { id: 1, formula: "1d20+0", nextSideEffectId: 1, sideEffects: {} } },
  } satisfies RollTrigger),

  EditorComponent: RollTriggerEditor,
  CardComponent: RollTriggerCard,

  // resolveTrigger and enqueue are provided by pressButton, already scoped to
  // the correct button. No getState needed here — no ID uniqueness assumed.
  execute: (trigger, resolveTrigger, enqueue) => (_dispatch, _getState): RollTriggerResult => {
    const { total, result } = executeEquations(trigger.equations, resolveTrigger, enqueue);
    return { type: "roll", name: trigger.name, total, result };
  },
}
